import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, UserCheck, Shield } from 'lucide-react';
import '../styles/visitor-form.css'; // Reusing glass-card styles

export default function WelcomeScreen() {
    const navigate = useNavigate();

    return (
        <div className="registration-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
            <div className="glass-card" style={{ width: '100%', maxWidth: '500px', padding: '4rem 3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>

                {/* Background glow effect */}
                <div style={{ position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(255,255,255,0) 70%)', zIndex: 0, pointerEvents: 'none' }}></div>

                <div
                    style={{
                        width: '96px', height: '96px',
                        borderRadius: '24px',
                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(14, 165, 233, 0.1))',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: '2rem',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), inset 0 2px 4px rgba(255,255,255,0.5)',
                        position: 'relative',
                        zIndex: 1
                    }}
                >
                    <ShieldCheck size={48} color="#3b82f6" />
                </div>

                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: 'var(--color-text)', letterSpacing: '-0.03em', position: 'relative', zIndex: 1 }}>
                    SecureGate
                </h1>

                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-primary-dark)', margin: '0 0 1.5rem 0', textTransform: 'uppercase', letterSpacing: '0.1em', position: 'relative', zIndex: 1 }}>
                    Smart Access Kiosk
                </h2>

                <p style={{ fontSize: '1.125rem', color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '3rem', position: 'relative', zIndex: 1, maxWidth: '320px' }}>
                    Welcome. Please tap the button below to register your visit.
                </p>

                <button
                    onClick={() => navigate('/register')}
                    style={{
                        width: '100%',
                        padding: '1.5rem',
                        background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '16px',
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '1rem',
                        boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4), 0 8px 10px -6px rgba(59, 130, 246, 0.1)',
                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                        position: 'relative',
                        zIndex: 1,
                        overflow: 'hidden'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(59, 130, 246, 0.5), 0 10px 10px -5px rgba(59, 130, 246, 0.2)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(59, 130, 246, 0.4), 0 8px 10px -6px rgba(59, 130, 246, 0.1)'; }}
                    onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(2px)'; }}
                    onMouseUp={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
                >
                    <UserCheck size={28} /> TAP TO START VISITOR ENTRY <ArrowRight size={28} />
                </button>

                <div style={{ marginTop: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.875rem', fontWeight: 500, position: 'relative', zIndex: 1 }}>
                    <Shield size={16} /> Encrypted Digital Access
                </div>
            </div>

            {/* Extremely subtle link to Admin Login for testing purposes */}
            <div
                style={{ position: 'absolute', bottom: '1rem', right: '1rem', color: 'rgba(0,0,0,0.1)', cursor: 'pointer', fontSize: '0.75rem', zIndex: 50 }}
                onClick={() => navigate('/admin-login')}
            >
                Admin
            </div>
        </div>
    );
}
