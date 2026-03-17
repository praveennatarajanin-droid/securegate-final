import React from 'react';
import { X, AlertTriangle, Trash2 } from 'lucide-react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, title, message, loading }) => {
    if (!isOpen) return null;

    return (
        <div 
            style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                padding: '1.5rem',
                fontFamily: "'Inter', sans-serif"
            }}
            onClick={onClose}
        >
            <div 
                style={{
                    backgroundColor: 'var(--admin-surface, #1e293b)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    borderRadius: '24px',
                    width: '100%',
                    maxWidth: '400px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    overflow: 'hidden',
                    animation: 'modalSlideUp 0.3s ease-out'
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header with Icon */}
                <div style={{ padding: '2rem 2rem 1rem', textAlign: 'center' }}>
                    <div style={{ 
                        width: '64px', 
                        height: '64px', 
                        backgroundColor: 'rgba(239, 68, 68, 0.1)', 
                        borderRadius: '20px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem',
                        color: '#ef4444'
                    }}>
                        <AlertTriangle size={32} />
                    </div>
                    <h3 style={{ 
                        fontSize: '1.25rem', 
                        fontWeight: 700, 
                        color: 'var(--admin-text-main, white)',
                        margin: '0 0 0.75rem'
                    }}>
                        {title || 'Delete Record?'}
                    </h3>
                    <p style={{ 
                        fontSize: '0.875rem', 
                        color: 'var(--admin-text-muted, #94a3b8)',
                        lineHeight: 1.5,
                        margin: 0
                    }}>
                        {message || 'This action cannot be undone. Are you sure you want to permanently remove this record?'}
                    </p>
                </div>

                {/* Actions */}
                <div style={{ padding: '1.5rem 2rem 2rem', display: 'flex', gap: '1rem' }}>
                    <button 
                        onClick={onClose}
                        disabled={loading}
                        style={{ 
                            flex: 1,
                            padding: '0.875rem',
                            borderRadius: '12px',
                            border: '1px solid var(--admin-border, #334155)',
                            background: 'transparent',
                            color: 'var(--admin-text-main, white)',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        Keep Record
                    </button>
                    <button 
                        onClick={onConfirm}
                        disabled={loading}
                        style={{ 
                            flex: 1,
                            padding: '0.875rem',
                            borderRadius: '12px',
                            border: 'none',
                            background: '#ef4444',
                            color: 'white',
                            fontSize: '0.875rem',
                            fontWeight: 700,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                            transition: 'all 0.2s',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? (
                            <div className="spin" style={{ 
                                width: '16px', 
                                height: '16px', 
                                border: '2px solid rgba(255,255,255,0.3)',
                                borderTopColor: 'white',
                                borderRadius: '50%',
                                animation: 'modalSpin 0.8s linear infinite'
                            }} />
                        ) : (
                            <Trash2 size={16} />
                        )}
                        {loading ? 'Deleting...' : 'Delete Now'}
                    </button>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes modalSlideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes modalSpin {
                    to { transform: rotate(360deg); }
                }
            `}} />
        </div>
    );
};

export default DeleteConfirmModal;
