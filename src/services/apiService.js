/* SecureGate — API Service
   Connects to the Laravel backend(Proxied via Vite)
   Falls back gracefully if the server is not running.
   ================================================================ */

let BASE_URL = import.meta.env.VITE_API_URL || '';
// Force relative proxy if local dev network to prevent "localhost" mixed-content blocks on mobile
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.startsWith('10.') || window.location.hostname.startsWith('192.')) {
    BASE_URL = '';
}

async function request(method, path, body = null) {
    try {
        const url = `${BASE_URL}/api${path}`;
        console.log(`📡 Sending ${method} to: ${url}`);

        const opts = {
            method,
            headers: { 'Content-Type': 'application/json' },
        };
        if (body) opts.body = JSON.stringify(body);

        const res = await fetch(url, opts);

        // Log the raw response for debugging (Task 4)
        const text = await res.text();
        console.log("Raw API response:", text);

        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const json = JSON.parse(text);
            if (!res.ok) throw new Error(json.message || `Server error ${res.status}`);
            return json;
        } else {
            // Server returned HTML or text (likely an error page)
            if (!res.ok) {
                console.error("Non-JSON Error:", text.substring(0, 500));
                throw new Error(`Server returned error ${res.status}: ${text.substring(0, 100)}...`);
            }
            throw new Error("Server did not return JSON. Body: " + text.substring(0, 100));
        }
    } catch (err) {
        console.error("❌ API Request Failed:", err);
        if (err.name === 'SyntaxError') {
            throw new Error("Server returned an invalid response (not JSON).");
        }
        // Network error — backend probably not running
        if (err.name === 'TypeError' && err.message.includes('fetch')) {
            throw new Error('Connection failed. Backend may be offline.');
        }
        throw err;
    }
}

export const apiService = {
    /* ── Visitor Registration ──────────────────────────────────
       POST /api/register
       Returns { requestId, approvalLink, smsStatus }            */
    async registerVisitor(data) {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const society_id = user.society_id || data.society_id;

        return request('POST', '/register', {
            name: data.name,
            phone: data.phone,
            flat: data.flat,
            purpose: data.purpose,
        });
    },

    /* ── Poll for status (visitor waiting screen) ──────────────
       GET /api/status/:id
       Returns { status: 'waiting' | 'approved' | 'denied' }     */
    async checkRequestStatus(requestId) {
        return request('GET', `/status/${requestId}`);
    },

    /* ── Get visitor details (resident verification page) ───────
       GET /api/request/:id                                       */
    async getRequestDetails(requestId) {
        return request('GET', `/request/${requestId}`);
    },

    /* ── Resident approves visitor ─────────────────────────────
       POST /api/approve/:id                                      */
    async approveVisitor(requestId) {
        return request('POST', `/approve/${requestId}`);
    },

    /* ── Resident rejects visitor ──────────────────────────────
       POST /api/reject/:id                                       */
    async rejectVisitor(requestId, reason = '') {
        return request('POST', `/reject/${requestId}`, { reason });
    },

    /* ── Legacy stubs (kept for other pages) ────────────────── */
    async verifyOTP(otp) {
        await new Promise(r => setTimeout(r, 1000));
        if (otp === '1234') return { success: true, message: 'OTP Verified.' };
        throw new Error('Invalid OTP');
    },

    async verifyQR() {
        await new Promise(r => setTimeout(r, 1000));
        return { success: true, message: 'QR Code Verified.' };
    },

    async openGate() {
        await new Promise(r => setTimeout(r, 1500));
        return { success: true, message: 'Gate Opened.' };
    },

    async recordExit(requestId) {
        return request('POST', `/exit/${requestId}`);
    },

    /* ── Get all visitors for dashboard/logs ────────────────── */
    async getAllVisitors(params = {}) {
        let path = '/visitors';
        const query = new URLSearchParams(params).toString();
        if (query) path += `?${query}`;
        return request('GET', path);
    },

    /* ── Society Management ────────────────────────────────── */
    async getAllSocieties() {
        return request('GET', '/societies');
    },

    async createSociety(data) {
        return request('POST', '/societies', data);
    },

    async updateSociety(id, data) {
        return request('PUT', `/societies/${id}`, data);
    },

    async deleteSociety(id) {
        return request('DELETE', `/societies/${id}`);
    },

    /* ── Admin Management ─────────────────────────────────── */
    async getAllAdmins(params = {}) {
        let path = '/admins';
        const query = new URLSearchParams(params).toString();
        if (query) path += `?${query}`;
        return request('GET', path);
    },

    async getAdminAuditLogs(params = {}) {
        let path = '/audit-logs';
        const query = new URLSearchParams(params).toString();
        if (query) path += `?${query}`;
        return request('GET', path);
    },

    async createAdmin(data) {
        return request('POST', '/admins', data);
    },

    async updateAdmin(id, data) {
        return request('PUT', `/admins/${id}`, data);
    },

    async deleteAdmin(id) {
        return request('DELETE', `/admins/${id}`);
    },

    async resendAdminInvitation(id, data = {}) {
        return request('POST', `/admins/${id}/resend-invitation`, data);
    },

    async bulkAdminAction(data) {
        return request('POST', '/admins/bulk-action', data);
    },
};
