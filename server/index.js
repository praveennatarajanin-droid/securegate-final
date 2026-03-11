require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const path = require('path');
const cors = require('cors');
const crypto = require('crypto');
const http = require('http');
const { Server } = require('socket.io');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const mysql = require('mysql2/promise');
const nodemailer = require('nodemailer');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

const PORT = process.env.PORT || 3001;

// ── Middleware ──
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'OPTIONS'] }));
app.use(express.json());

// ── In-memory Fallback ──
const memoryStore = {};

// ── Database Setup (SQLite) ──
let dbPool = null;

async function initDB() {
    try {
        if (process.env.DB_HOST) {
            // ── MySQL Connection ──
            dbPool = await mysql.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME
            });

            await dbPool.query(`
                CREATE TABLE IF NOT EXISTS visitor_requests (
                    id VARCHAR(50) PRIMARY KEY,
                    name VARCHAR(255),
                    phone VARCHAR(20),
                    flat VARCHAR(50),
                    purpose VARCHAR(255),
                    timestamp VARCHAR(50),
                    status VARCHAR(50) DEFAULT 'waiting',
                    reason VARCHAR(255),
                    createdAt BIGINT
                )
            `);
            console.log("✅ MySQL Database initialized successfully.");
        } else {
            // ── SQLite Connection ──
            dbPool = await open({
                filename: require('path').join(__dirname, 'securegate.db'),
                driver: sqlite3.Database
            });

            await dbPool.exec(`
                CREATE TABLE IF NOT EXISTS visitor_requests (
                    id TEXT PRIMARY KEY,
                    name TEXT,
                    phone TEXT,
                    flat TEXT,
                    purpose TEXT,
                    timestamp TEXT,
                    status TEXT DEFAULT 'waiting',
                    reason TEXT,
                    createdAt INTEGER
                )
            `);
            console.log("✅ SQLite Database initialized successfully.");
        }
    } catch (err) {
        console.error("❌ CRITICAL: Database initialization failed:", err.message);
        dbPool = null;
    }
}
initDB();

// ── Email Setup ──
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || '',   // Example: yourgmail@gmail.com
        pass: process.env.EMAIL_PASS || ''    // Example: Your 16-character App Password
    }
});

// ── Helpers ──
const generateId = () => crypto.randomBytes(8).toString('hex');
const formatTime = () => new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

async function saveRequest(reqData) {
    if (dbPool) {
        const query = `INSERT INTO visitor_requests (id, name, phone, flat, purpose, timestamp, status, createdAt) 
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const params = [reqData.id, reqData.name, reqData.phone, reqData.flat, reqData.purpose, reqData.timestamp, reqData.status, reqData.createdAt];

        if (process.env.DB_HOST) {
            await dbPool.query(query, params);
        } else {
            await dbPool.run(query, params);
        }
    } else {
        memoryStore[reqData.id] = reqData;
    }
}

async function getRequest(id) {
    if (dbPool) {
        const query = 'SELECT * FROM visitor_requests WHERE id = ?';
        if (process.env.DB_HOST) {
            const [rows] = await dbPool.query(query, [id]);
            return rows[0];
        } else {
            return await dbPool.get(query, [id]);
        }
    }
    return memoryStore[id];
}

async function updateRequestStatus(id, status, reason = '') {
    if (dbPool) {
        const query = 'UPDATE visitor_requests SET status = ?, reason = ? WHERE id = ?';
        if (process.env.DB_HOST) {
            await dbPool.query(query, [status, reason, id]);
        } else {
            await dbPool.run(query, [status, reason, id]);
        }
    } else {
        if (memoryStore[id]) {
            memoryStore[id].status = status;
            memoryStore[id].reason = reason;
        }
    }
}

// ══════════════════════════════════════════════════════
//  SOCKET.IO SERVER
// ══════════════════════════════════════════════════════
io.on('connection', (socket) => {
    socket.on('join-room', (roomId) => {
        socket.join(roomId);
    });

    socket.on('resident-joined', (roomId) => {
        socket.to(roomId).emit('resident-joined');
    });

    socket.on('visitor-ready', (roomId) => {
        socket.to(roomId).emit('visitor-ready');
    });

    socket.on('offer', (data) => {
        socket.to(data.roomId).emit('offer', data.offer);
    });

    socket.on('answer', (data) => {
        socket.to(data.roomId).emit('answer', data.answer);
    });

    socket.on('ice-candidate', (data) => {
        socket.to(data.roomId).emit('ice-candidate', data.candidate);
    });
});

// ══════════════════════════════════════════════════════
//  ROUTES
// ══════════════════════════════════════════════════════
app.get('/api/health', (_, res) => res.json({ status: 'ok', time: new Date() }));

// ── Internal Broadcast Endpoint for Laravel ──────────
app.post('/api/internal/status-update', (req, res) => {
    const { requestId, status, reason } = req.body;
    if (!requestId || !status) return res.status(400).json({ success: false });

    io.to(requestId).emit('status-update', { status, reason });
    console.log(`[Internal Broadcast] ${status} for ${requestId}`);
    return res.json({ success: true });
});

// ── POST /api/register ──────────────────────────────
app.post('/api/register', async (req, res) => {
    console.log(`[API POST] /register received at ${new Date().toISOString()}`);
    const { name, phone, flat, purpose } = req.body;
    if (!name || !phone || !flat || !purpose) return res.status(400).json({ success: false, message: 'All fields are required.' });

    const requestId = generateId();
    const timestamp = formatTime();

    const requestData = { id: requestId, name: name.trim(), phone: phone.trim(), flat: flat.trim(), purpose: purpose.trim(), timestamp, status: 'waiting', createdAt: Date.now() };

    await saveRequest(requestData);

    // Extract the origin dynamically for the verify link
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const currentHost = req.headers.host;
    const verifyLink = `${protocol}://${currentHost}/resident/${requestId}`;

    // Define the recipient
    const recipientEmail = 'vinithkumar78878@gmail.com';

    const mailOptions = {
        from: `"SecureGate System" <${process.env.EMAIL_USER || 'no-reply@securegate.local'}>`,
        to: recipientEmail,
        subject: `Gate Alert: Visitor for Flat ${flat.trim()}`,
        text: `SecureGate Visitor Alert

Visitor: ${name.trim()}
Purpose: ${purpose.trim()}
Flat: ${flat.trim()}

Tap the link to view and approve the visitor:
${verifyLink}`,
        html: `<h2>SecureGate Visitor Alert</h2>
               <p><strong>Visitor:</strong> ${name.trim()}</p>
               <p><strong>Purpose:</strong> ${purpose.trim()}</p>
               <p><strong>Flat:</strong> ${flat.trim()}</p>
               <br/>
               <a href="${verifyLink}" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">View & Approve Visitor</a>
               <br/><br/>
               <p><small>Or copy this link: ${verifyLink}</small></p>`
    };

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        try {
            await transporter.sendMail(mailOptions);
            console.log(`✅ Email sent securely to ${recipientEmail} via Nodemailer.`);
        } catch (err) {
            console.error('Email sending failed:', err.message);
        }
    } else {
        console.log('\n\n===============================================================');
        console.log(`🛎️  🔔 VIRTUAL EMAIL DELIVERED (No Credentials Found) 🔔  🛎️`);
        console.log('===============================================================');
        console.log(`To: ${recipientEmail}`);
        console.log('Message:');
        console.log(mailOptions.text);
        console.log('===============================================================');
        console.log(`⚠️  NOTE: To actually send emails, add EMAIL_USER and EMAIL_PASS to server/.env!`);
        console.log('===============================================================\n\n');
    }

    return res.json({ success: true, message: 'Visitor registered.', data: { requestId } });
});

app.get('/api/request/:id', async (req, res) => {
    const request = await getRequest(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found.' });
    return res.json({ success: true, data: request });
});

app.get('/api/status/:id', async (req, res) => {
    const request = await getRequest(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found.' });
    return res.json({ success: true, status: request.status, reason: request.reason });
});

app.post('/api/approve/:id', async (req, res) => {
    const requestId = req.params.id;
    const request = await getRequest(requestId);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found.' });

    await updateRequestStatus(requestId, 'approved');
    console.log(`[Approve] Request ${requestId} APPROVED`);

    io.to(requestId).emit('status-update', { status: 'approved' });

    return res.json({ success: true, message: 'Visitor approved.' });
});

app.post('/api/reject/:id', async (req, res) => {
    const requestId = req.params.id;
    const request = await getRequest(requestId);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found.' });

    const reason = req.body.reason || 'Not expecting anyone';
    await updateRequestStatus(requestId, 'denied', reason);
    console.log(`[Reject] Request ${requestId} DENIED - Reason: ${reason}`);

    io.to(requestId).emit('status-update', { status: 'denied', reason });

    return res.json({ success: true, message: 'Visitor rejected.', reason });
});

// ── GET /api/visitors ────────────────────────────────
app.get('/api/visitors', async (req, res) => {
    try {
        let visitors = [];
        if (dbPool) {
            if (process.env.DB_HOST) {
                // MySQL
                const [rows] = await dbPool.query('SELECT * FROM visitor_requests ORDER BY createdAt DESC');
                visitors = rows;
            } else {
                // SQLite
                visitors = await dbPool.all('SELECT * FROM visitor_requests ORDER BY createdAt DESC');
            }
        } else {
            visitors = Object.values(memoryStore).sort((a, b) => b.createdAt - a.createdAt);
        }
        return res.json({ success: true, data: visitors });
    } catch (err) {
        console.error('Fetch visitors failed:', err.message);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});

// ── Serve Frontend ──
app.use(express.static(path.join(__dirname, '../dist')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🛡  SecureGate Real-time Backend + WebRTC Signaling running on port ${PORT}`);
});
