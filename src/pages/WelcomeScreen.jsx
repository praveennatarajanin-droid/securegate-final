import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, UserCheck, Shield } from 'lucide-react';
import '../styles/visitor-form.css';

export default function WelcomeScreen() {
    const navigate = useNavigate();

    return (
        <div className="registration-page" style={{ alignItems: 'center', justifyContent: 'center' }}>
            <div className="registration-container">
                <div className="glass-card" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    padding: '2.5rem 2rem 2.25rem',
                    position: 'relative',
                    overflow: 'hidden',
                }}>
                    {/* Glow decoration */}
                    <div style={{
                        position: 'absolute', top: '-80px', left: '50%', transform: 'translateX(-50%)',
                        width: '280px', height: '280px',
                        background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
                        pointerEvents: 'none',
                    }} />

                    {/* Logo icon */}
                    <div style={{
                        width: '76px', height: '76px',
                        borderRadius: '20px',
                        background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(14,165,233,0.1))',
                        border: '1px solid rgba(59,130,246,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: '1.4rem',
                        position: 'relative', zIndex: 1,
                        boxShadow: '0 4px 6px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.7)',
                    }}>
                        <ShieldCheck size={40} color="#3b82f6" />
                    </div>

                    <h1 style={{
                        fontSize: '2.25rem', fontWeight: 800,
                        margin: '0 0 0.375rem 0',
                        color: '#1f2937',
                        letterSpacing: '-0.03em',
                        position: 'relative', zIndex: 1,
                    }}>
                        SecureGate
                    </h1>

                    <p style={{
                        fontSize: '0.9rem', fontWeight: 600,
                        color: '#3b82f6', margin: '0 0 1.25rem 0',
                        textTransform: 'uppercase', letterSpacing: '0.1em',
                        position: 'relative', zIndex: 1,
                    }}>
                        Smart Access Kiosk
                    </p>

                    <p style={{
                        fontSize: '0.95rem', color: '#6b7280',
                        lineHeight: 1.55, marginBottom: '2rem',
                        position: 'relative', zIndex: 1, maxWidth: '300px',
                    }}>
                        Welcome! Please tap the button below to register your visit.
                    </p>

                    <button
                        onClick={() => navigate('/register')}
                        style={{
                            width: '100%',
                            padding: '1.25rem 1rem',
                            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '14px',
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.875rem',
                            boxShadow: '0 8px 20px rgba(59,130,246,0.35)',
                            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                            position: 'relative', zIndex: 1,
                            letterSpacing: '0.01em',
                        }}
                        onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 14px 28px rgba(59,130,246,0.45)'; }}
                        onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(59,130,246,0.35)'; }}
                        onMouseDown={e => { e.currentTarget.style.transform = 'translateY(1px)'; }}
                        onMouseUp={e => { e.currentTarget.style.transform = 'translateY(-3px)'; }}
                    >
                        <UserCheck size={24} />
                        TAP TO START VISITOR ENTRY
                        <ArrowRight size={22} />
                    </button>

                    <div style={{
                        marginTop: '1.5rem',
                        display: 'flex', alignItems: 'center', gap: '0.4rem',
                        color: '#94a3b8', fontSize: '0.78rem', fontWeight: 500,
                        position: 'relative', zIndex: 1,
                    }}>
                        <Shield size={13} /> Encrypted Digital Access
                    </div>
                </div>
            </div>

            {/* Hidden admin link */}
            <div
                style={{ position: 'fixed', bottom: '1rem', right: '1rem', color: 'transparent', cursor: 'pointer', fontSize: '0.75rem', zIndex: 50, userSelect: 'none' }}
                onClick={() => navigate('/admin-login')}
            >
                Admin
            </div>
        </div>
    );
}
