import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, User, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [errorLine, setErrorLine] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrorLine('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.username || !formData.password) {
            setErrorLine('Please fill in both fields.');
            return;
        }

        setIsLoading(true);

        // Simulate authentication
        setTimeout(() => {
            if (formData.username === 'admin' && formData.password === 'admin') {
                navigate('/dashboard');
            } else {
                setErrorLine('Invalid username or password.');
                setIsLoading(false);
            }
        }, 1200);
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            width: '100vw',
            background: '#f3f4f6',
            fontFamily: 'Inter, sans-serif'
        }}>
            <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                padding: '3rem 2.5rem',
                borderRadius: '24px',
                width: '100%',
                maxWidth: '420px',
                boxShadow: '0 25px 50px -12px rgba(230, 75, 32, 0.3)'
            }}>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2.5rem' }}>
                    <div style={{
                        width: '64px', height: '64px',
                        background: '#FFF5F2',
                        border: '1px solid #FDD8CF',
                        borderRadius: '16px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: '1rem'
                    }}>
                        <ShieldCheck size={36} color="#FF5C2A" />
                    </div>
                    <h1 style={{ color: '#1a1e26', fontSize: '1.75rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>SecureGate Admin</h1>
                    <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem' }}>Login to access the security dashboard</p>
                </div>

                {errorLine && (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        color: '#ef4444',
                        padding: '1rem',
                        borderRadius: '12px',
                        marginBottom: '1.5rem',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <AlertCircle size={18} />
                        {errorLine}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
                        <User size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                background: '#f8fafc',
                                border: '1px solid #e2e8f0',
                                padding: '1.25rem 1.25rem 1.25rem 3.25rem',
                                borderRadius: '12px',
                                color: '#1f2937',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'border-color 0.2s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#FF5C2A'}
                            onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                        />
                    </div>

                    <div style={{ position: 'relative', marginBottom: '2rem' }}>
                        <Lock size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                background: '#f8fafc',
                                border: '1px solid #e2e8f0',
                                padding: '1.25rem 1.25rem 1.25rem 3.25rem',
                                borderRadius: '12px',
                                color: '#1f2937',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'border-color 0.2s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#FF5C2A'}
                            onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            width: '100%',
                            padding: '1.125rem',
                            background: '#FF5C2A',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '1.05rem',
                            fontWeight: 600,
                            cursor: isLoading ? 'wait' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.75rem',
                            transition: 'background 0.2s, transform 0.2s'
                        }}
                        onMouseOver={(e) => !isLoading && (e.currentTarget.style.background = '#FF5C2A')}
                        onMouseOut={(e) => !isLoading && (e.currentTarget.style.background = '#FF5C2A')}
                        onMouseDown={(e) => !isLoading && (e.currentTarget.style.transform = 'translateY(1px)')}
                        onMouseUp={(e) => !isLoading && (e.currentTarget.style.transform = 'translateY(0)')}
                    >
                        {isLoading ? (
                            <>Authenticating <Loader2 size={20} className="animate-spin" /></>
                        ) : (
                            <>Sign In to Dashboard <ArrowRight size={20} /></>
                        )}
                    </button>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.875rem', color: '#64748b' }}>
                    Protected by SecureGate v2.0 Enterprise
                </div>
            </div>
        </div>
    );
}
