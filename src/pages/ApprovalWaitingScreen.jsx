import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Loader2, CheckCircle2, User, Home, Briefcase, Clock, Phone } from 'lucide-react';
import '../styles/visitor-form.css'; // Reusing glass-card styles

export default function ApprovalWaitingScreen() {
    const navigate = useNavigate();
    const location = useLocation();

    // Status states: 'waiting' -> 'approved'
    const [status, setStatus] = useState('waiting');

    // Mock user data from registration (fallback to defaults if direct navigation)
    const visitorFlat = location.state?.flat || 'A-101';

    useEffect(() => {
        // Simulate a 5 second waiting period, then "resident approves"
        const toggleTimer = setTimeout(() => {
            setStatus('approved');

            // Wait 3 seconds on the 'approved' screen before moving on
            setTimeout(() => {
                navigate('/video-verification', { state: location.state });
            }, 3500);

        }, 5000);

        return () => clearTimeout(toggleTimer);
    }, [navigate, location.state]);

    if (status === 'approved') {
        return (
            <div className="registration-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
                <div className="glass-card approval-indicator" style={{ background: 'rgba(255, 255, 255, 0.95)', border: '2px solid rgba(16, 185, 129, 0.3)', width: '100%' }}>

                    <div className="trust-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#065f46', borderColor: 'rgba(16, 185, 129, 0.3)', marginBottom: '1.5rem' }}>
                        <ShieldCheck size={16} /> Secure Verification Complete
                    </div>

                    <div style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', animation: 'ripple 2s ease-out infinite' }}></div>
                        <div style={{ position: 'absolute', inset: '15px', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '50%', animation: 'ripple 2s ease-out infinite', animationDelay: '0.5s' }}></div>
                        <CheckCircle2 size={80} color="var(--color-success)" style={{ position: 'relative', zIndex: 2, background: 'white', borderRadius: '50%' }} />
                    </div>

                    <h1 style={{ color: 'var(--text-main)', fontSize: '2.5rem', margin: '0 0 1rem 0' }}>ENTRY APPROVED</h1>

                    <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', width: '100%', maxWidth: '350px' }}>
                        <p style={{ margin: 0, color: 'var(--admin-text-main)', fontSize: '1.125rem', fontWeight: 500 }}>
                            You may now proceed to the gate.
                        </p>
                        <p style={{ margin: '0.5rem 0 0 0', color: 'var(--admin-text-muted)', fontSize: '0.9rem' }}>
                            The security guard has been notified directly. Loading Entry Demo...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Default 'Waiting' Screen
    return (
        <div className="registration-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
            <div className="glass-card" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '3rem 2rem' }}>

                <div style={{
                    width: '80px', height: '80px',
                    borderRadius: '50%',
                    background: 'var(--admin-bg)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '2rem',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                }}>
                    <Loader2 size={40} color="var(--color-primary)" className="animate-spin" />
                </div>

                <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: 'var(--admin-text-main)' }}>Your request has been sent!</h2>
                <p style={{ color: 'var(--admin-text-muted)', fontSize: '1.125rem', lineHeight: 1.5, marginBottom: '2.5rem', maxWidth: '320px' }}>
                    Please wait while the resident at <strong style={{ color: 'var(--admin-text-main)' }}>Flat {visitorFlat}</strong> reviews your entry request.
                </p>

                <div style={{ width: '100%', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem', display: 'grid', gap: '1rem', textAlign: 'left' }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                        Transmitting Summary
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Home size={16} /></div>
                        <div style={{ flex: 1 }}>
                            <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b' }}>Destination</span>
                            <span style={{ display: 'block', color: '#0f172a', fontWeight: 600 }}>Flat A-101</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Briefcase size={16} /></div>
                        <div style={{ flex: 1 }}>
                            <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b' }}>Purpose</span>
                            <span style={{ display: 'block', color: '#0f172a', fontWeight: 600 }}>Delivery</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#ede9fe', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Clock size={16} /></div>
                        <div style={{ flex: 1 }}>
                            <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b' }}>Request Time</span>
                            <span style={{ display: 'block', color: '#0f172a', fontWeight: 600 }}>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
