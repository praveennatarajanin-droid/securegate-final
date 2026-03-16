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
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── In-memory Fallback ──
const memoryStore = {};

// ── Database Setup (SQLite for visitor_requests) ──
let dbPool = null;

// ── Separate connection to Laravel's SQLite DB (for residents lookup) ──
let laravelDb = null;
async function initLaravelDb() {
    try {
        const laravelDbPath = process.env.LARAVEL_DB_PATH
            ? require('path').resolve(__dirname, process.env.LARAVEL_DB_PATH)
            : require('path').join(__dirname, '..', 'laravel-backend', 'database', 'database.sqlite');
        laravelDb = await open({
            filename: laravelDbPath,
            driver: sqlite3.Database
        });
        console.log(`✅ Laravel SQLite DB connected: ${laravelDbPath}`);
    } catch (err) {
        console.error('⚠️  Could not connect to Laravel SQLite DB:', err.message);
        laravelDb = null;
    }
}

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
                    visitor_photo LONGTEXT,
                    createdAt BIGINT
                )
            `);
            console.log("✅ MySQL Database initialized successfully.");
        } else {
            // ── SQLite Connection (visitor_requests only) ──
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
                    visitor_photo TEXT,
                    createdAt INTEGER
                )
            `);
            
            // Migration: Ensure visitor_photo exists
            try {
                await dbPool.exec(`ALTER TABLE visitor_requests ADD COLUMN visitor_photo TEXT`);
                console.log("✅ visitor_photo column added to existing SQLite database.");
            } catch (e) {
                // Column likely exists
            }
            console.log("✅ SQLite Database initialized successfully.");
        }
    } catch (err) {
        console.error("❌ CRITICAL: Database initialization failed:", err.message);
        dbPool = null;
    }
}
initDB();
initLaravelDb();

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
        const query = `INSERT INTO visitor_requests (id, name, phone, flat, purpose, timestamp, status, visitor_photo, createdAt) 
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const params = [reqData.id, reqData.name, reqData.phone, reqData.flat, reqData.purpose, reqData.timestamp, reqData.status, reqData.visitor_photo, reqData.createdAt];

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
    console.log(`📡 New Socket Connection: ${socket.id}`);

    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log(`🏠 Socket ${socket.id} joined room: ${roomId}`);
    });

    socket.on('resident-joined', (roomId) => {
        console.log(`👤 Resident joined room: ${roomId}`);
        socket.to(roomId).emit('resident-joined');
    });

    socket.on('visitor-ready', (roomId) => {
        console.log(`📟 Visitor ready in room: ${roomId}`);
        socket.to(roomId).emit('visitor-ready');
    });

    socket.on('offer', (data) => {
        console.log(`📤 Offer sent in room: ${data.roomId}`);
        socket.to(data.roomId).emit('offer', data.offer);
    });

    socket.on('answer', (data) => {
        console.log(`📥 Answer sent in room: ${data.roomId}`);
        socket.to(data.roomId).emit('answer', data.answer);
    });

    socket.on('ice-candidate', (data) => {
        socket.to(data.roomId).emit('ice-candidate', data.candidate);
    });

    socket.on('disconnect', () => {
        console.log(`🔌 Socket Disconnected: ${socket.id}`);
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
    const { name, phone, flat, purpose, visitor_photo } = req.body;
    if (!name || !phone || !flat || !purpose) return res.status(400).json({ success: false, message: 'All fields are required.' });

    const requestId = generateId();
    const timestamp = formatTime();

    const requestData = { 
        id: requestId, 
        name: name.trim(), 
        phone: phone.trim(), 
        flat: flat.trim(), 
        purpose: purpose.trim(), 
        timestamp, 
        status: 'waiting', 
        visitor_photo: visitor_photo || null,
        createdAt: Date.now() 
    };

    await saveRequest(requestData);

    // Extract the origin dynamically for the verify link
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const currentHost = req.headers.host;
    // Uses FRONTEND_HOST from .env (e.g., https://localhost:5173) so the link goes to the UI
    const frontendBase = process.env.FRONTEND_HOST || `${protocol}://${currentHost}`;
    const verifyLink = `${frontendBase}/resident/${requestId}`;

    // Look up resident email by flat number
    console.log(`🔍 Looking up resident for flat: "${flat.trim()}"`);
    let recipientEmail = '';
    try {
        if (process.env.DB_HOST && dbPool) {
            const [rows] = await dbPool.query('SELECT email, additional_email FROM residents WHERE flat = ?', [flat.trim()]);
            if (rows.length > 0) {
                const emails = [];
                if (rows[0].email) emails.push(rows[0].email);
                if (rows[0].additional_email) emails.push(rows[0].additional_email);
                if (emails.length > 0) recipientEmail = emails.join(', ');
            }
        } else if (laravelDb) {
            const row = await laravelDb.get('SELECT email, additional_email FROM residents WHERE flat = ?', [flat.trim()]);
            if (row) {
                console.log(`✅ Found resident: ${row.email}`);
                const emails = [];
                if (row.email) emails.push(row.email);
                if (row.additional_email) emails.push(row.additional_email);
                if (emails.length > 0) recipientEmail = emails.join(', ');
            } else {
                console.warn(`❌ No resident found in Laravel DB for flat: "${flat.trim()}"`);
            }
        }
    } catch (err) {
        console.error("Error looking up resident email:", err.message);
    }

    if (!recipientEmail) {
        console.warn(`⚠️  No resident email found for flat: ${flat.trim()}. Visitor registered but email not sent.`);
        return res.json({ success: true, message: 'Visitor registered. No resident email found for this flat.', data: { requestId } });
    }

    console.log(`📧 Sending email to: ${recipientEmail} for flat ${flat.trim()}`);

    const visitTime  = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

    const mailOptions = {
        from: `"SecureGate System" <${process.env.EMAIL_USER || 'no-reply@securegate.local'}>`,
        to: recipientEmail,
        subject: `🔔 Visitor Request – Flat ${flat.trim()} | SecureGate`,
        text: `SecureGate Visitor Alert\n\nVisitor: ${name.trim()}\nPhone: ${phone.trim()}\nPurpose: ${purpose.trim()}\nFlat: ${flat.trim()}\nTime: ${visitTime}\n\nView and Verify: ${verifyLink}\n\nSecureGate – Smart Visitor Access System`,
        html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>SecureGate Visitor Alert</title></head>
<body style="margin:0;padding:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;background:#f0f2f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f2f5;padding:30px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.10);">
        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%);padding:32px 40px;text-align:center;">
          <div style="display:inline-block;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);border-radius:10px;padding:12px 28px;">
            <span style="color:#f97316;font-size:22px;font-weight:900;letter-spacing:2px;">SECURE</span><span style="color:#ffffff;font-size:22px;font-weight:300;letter-spacing:2px;">GATE</span>
            <div style="color:rgba(255,255,255,0.5);font-size:10px;letter-spacing:3px;margin-top:2px;">SMART VISITOR ACCESS</div>
          </div>
          <div style="margin-top:18px;display:inline-block;background:#3b82f6;color:white;font-size:11px;font-weight:700;letter-spacing:2px;padding:5px 16px;border-radius:20px;">VISITOR ALERT</div>
        </td></tr>
        <!-- Intro -->
        <tr><td style="padding:32px 40px 10px;">
          <p style="color:#374151;font-size:15px;line-height:1.6;margin:0;">Hello,</p>
          <p style="color:#374151;font-size:15px;line-height:1.6;margin:10px 0 0;">A visitor is requesting access to your residence. Please review the details below and proceed to verify.</p>
        </td></tr>
        <!-- Visitor Card -->
        <tr><td style="padding:20px 40px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;">
            <tr><td style="background:#1e293b;padding:12px 20px;">
              <span style="color:#f97316;font-size:12px;font-weight:700;letter-spacing:1.5px;">VISITOR DETAILS</span>
            </td></tr>
            <tr><td style="padding:20px;">
              <table width="100%" cellpadding="6" cellspacing="0">
                <tr>
                  <td style="color:#64748b;font-size:13px;font-weight:600;width:40%;">👤 &nbsp;Visitor Name</td>
                  <td style="color:#1e293b;font-size:14px;font-weight:700;">${name.trim()}</td>
                </tr>
                <tr style="background:#f1f5f9;">
                  <td style="color:#64748b;font-size:13px;font-weight:600;">📞 &nbsp;Phone Number</td>
                  <td style="color:#1e293b;font-size:14px;font-weight:700;">${phone.trim()}</td>
                </tr>
                <tr>
                  <td style="color:#64748b;font-size:13px;font-weight:600;">📋 &nbsp;Purpose</td>
                  <td style="color:#1e293b;font-size:14px;font-weight:700;">${purpose.trim()}</td>
                </tr>
                <tr style="background:#f1f5f9;">
                  <td style="color:#64748b;font-size:13px;font-weight:600;">🏠 &nbsp;Your Flat</td>
                  <td style="color:#1e293b;font-size:14px;font-weight:700;">${flat.trim()}</td>
                </tr>
                <tr>
                  <td style="color:#64748b;font-size:13px;font-weight:600;">🕐 &nbsp;Date &amp; Time</td>
                  <td style="color:#1e293b;font-size:14px;font-weight:700;">${visitTime}</td>
                </tr>
              </table>
            </td></tr>
          </table>
        </td></tr>
        <!-- Action Buttons -->
        <tr><td style="padding:10px 40px 30px;">
          <p style="color:#64748b;font-size:13px;text-align:center;margin:0 0 18px;">Tap the button below to view the visitor and approve or reject access:</p>
          <div style="text-align:center;">
             <a href="${verifyLink}" style="display:inline-block;background:linear-gradient(135deg,#3b82f6,#2563eb);color:#ffffff;text-align:center;padding:16px 32px;border-radius:10px;text-decoration:none;font-size:16px;font-weight:700;letter-spacing:0.5px;min-width:200px;">🔍 &nbsp;View &amp; Verify Visitor</a>
          </div>
        </td></tr>
        <!-- Footer -->
        <tr><td style="background:#1e293b;padding:20px 40px;text-align:center;">
          <p style="color:#f97316;font-size:13px;font-weight:700;margin:0 0 6px;">SecureGate – Smart Visitor Access System</p>
          <p style="color:#94a3b8;font-size:11px;margin:0;">If you did not expect this visitor, please reject the request immediately. Do not share this email with anyone.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
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
