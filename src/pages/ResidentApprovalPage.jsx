import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { ShieldCheck, User, Phone, Briefcase, Home, Clock, X, Check, Loader2, Camera, UserX } from 'lucide-react';

export default function ResidentApprovalPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [visitor, setVisitor] = useState({
        name: "Rahul Sharma",
        phone: "+91 9876543210",
        flat: "A-101",
        purpose: "Delivery / Courier",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    const [loading, setLoading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [decision, setDecision] = useState(null);

    // In a real app we would fetch the details
    /*
    useEffect(() => {
      ...
    }, [id]);
    */

    const handleApprove = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setDecision('approved');
            setIsProcessing(false);
        }, 1500);
    };

    const handleReject = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setDecision('denied');
            setIsProcessing(false);
        }, 1500);
    };

    // Mobile layout container
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            width: '100vw',
            background: '#e0e7ff',
            fontFamily: 'Inter, sans-serif'
        }}>

            {/* Mobile Device Mockup Container */}
            <div style={{
                background: '#ffffff',
                width: '100%',
                maxWidth: '430px', /* iPhone width approx */
                minHeight: '100vh',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden'
            }}>

                {/* Header App Bar */}
                <div style={{
                    background: '#FF5C2A',
                    color: 'white',
                    padding: '2.5rem 1.5rem 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                }}>
                    <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.5rem', borderRadius: '12px' }}>
                        <ShieldCheck size={28} />
                    </div>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>SecureGate</h2>
                        <span style={{ fontSize: '0.85rem', opacity: 0.9 }}>Resident Approval System</span>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', background: '#f8fafc' }}>

                    {decision ? (
                        <div style={{
                            background: decision === 'approved' ? '#d1fae5' : '#fee2e2',
                            border: `1px solid ${decision === 'approved' ? '#34d399' : '#f87171'}`,
                            padding: '2rem 1.5rem',
                            borderRadius: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            marginTop: '2rem',
                            animation: 'scaleIn 0.3s ease-out'
                        }}>
                            <div style={{
                                width: '80px', height: '80px',
                                borderRadius: '50%',
                                background: decision === 'approved' ? '#10b981' : '#ef4444',
                                color: 'white',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: '1rem'
                            }}>
                                {decision === 'approved' ? <Check size={40} /> : <X size={40} />}
                            </div>
                            <h2 style={{ color: decision === 'approved' ? '#065f46' : '#991b1b', margin: '0 0 0.5rem 0' }}>
                                {decision === 'approved' ? 'Entry Approved' : 'Entry Denied'}
                            </h2>
                            <p style={{ color: decision === 'approved' ? '#064e3b' : '#7f1d1d', margin: 0 }}>
                                {decision === 'approved' ? 'The gate system has been notified. The visitor is proceeding to your flat.' : 'The guard has been notified to deny entry.'}
                            </p>
                            <button
                                onClick={() => window.close()}
                                style={{ marginTop: '2rem', padding: '0.75rem 2rem', background: 'transparent', border: `1px solid ${decision === 'approved' ? '#10b981' : '#ef4444'}`, color: decision === 'approved' ? '#065f46' : '#991b1b', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                                Close Window
                            </button>
                        </div>
                    ) : (
                        <>
                            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', background: '#fee2e2', color: '#dc2626', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.875rem', fontWeight: 600, alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                                    <Clock size={16} /> Action Required: Visitor Waiting
                                </div>
                            </div>

                            {/* Fake Live Camera Component */}
                            <div style={{
                                width: '100%',
                                height: '240px',
                                background: '#0f172a',
                                borderRadius: '16px',
                                marginBottom: '1.5rem',
                                position: 'relative',
                                overflow: 'hidden',
                                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                            }}>
                                <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'rgba(220, 38, 38, 0.9)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', zIndex: 2 }}>
                                    <span style={{ width: '8px', height: '8px', background: 'white', borderRadius: '50%', animation: 'pulse 2s infinite' }}></span> LIVE
                                </div>

                                {/* Fake video feed aesthetic */}
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155' }}>
                                    <User size={120} />
                                    {/* Add a scanning line animation using raw css inject below */}
                                </div>

                                <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', background: 'rgba(0, 0, 0, 0.6)', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Camera size={14} /> Kiosk Cam A1
                                </div>
                            </div>

                            {/* Visitor Details Card */}
                            <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
                                <h3 style={{ margin: '0 0 1rem 0', color: '#0f172a', fontSize: '1.125rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>Visitor Details</h3>

                                <div style={{ display: 'grid', gap: '1rem' }}>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <User size={18} />
                                        </div>
                                        <div>
                                            <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Full Name</span>
                                            <span style={{ display: 'block', color: '#0f172a', fontWeight: 500 }}>{visitor.name}</span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <Briefcase size={18} />
                                        </div>
                                        <div>
                                            <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Purpose</span>
                                            <span style={{ display: 'block', color: '#0f172a', fontWeight: 500 }}>{visitor.purpose}</span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f3e8ff', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <Phone size={18} />
                                        </div>
                                        <div>
                                            <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Phone Number</span>
                                            <span style={{ display: 'block', color: '#0f172a', fontWeight: 500 }}>{visitor.phone}</span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <Clock size={18} />
                                        </div>
                                        <div>
                                            <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Request Time</span>
                                            <span style={{ display: 'block', color: '#0f172a', fontWeight: 500 }}>{visitor.time}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                </div>

                {/* Floating Action Buttons */}
                {!decision && (
                    <div style={{ background: 'white', padding: '1rem 1.5rem', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '1rem', boxShadow: '0 -4px 6px -1px rgba(0,0,0,0.05)' }}>
                        <button
                            disabled={isProcessing}
                            onClick={handleReject}
                            style={{ flex: 1, padding: '1rem', background: '#fff1f2', color: '#e11d48', border: '1px solid #ffe4e6', borderRadius: '12px', fontWeight: 600, fontSize: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
                        >
                            {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <><X size={20} /> Deny</>}
                        </button>
                        <button
                            disabled={isProcessing}
                            onClick={handleApprove}
                            style={{ flex: 2, padding: '1rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 600, fontSize: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.4)' }}
                        >
                            {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <><Check size={20} /> Approve Entry</>}
                        </button>
                    </div>
                )}

                <style>{`
          @keyframes pulse {
            0% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.5); }
            100% { opacity: 1; transform: scale(1); }
          }
          @keyframes scaleIn {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
        `}</style>
            </div>
        </div>
    );
}
