import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { Shield, MapPin, Check, ArrowRight, Loader2, Settings } from 'lucide-react';

const KioskSetup = () => {
    const [societies, setSocieties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState(localStorage.getItem('kiosk_society_id') || '');
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSocieties = async () => {
            try {
                const response = await apiService.getAllSocieties();
                if (response.success) {
                    setSocieties(response.data);
                }
            } catch (err) {
                console.error("Failed to fetch societies:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSocieties();
    }, []);

    const handleSave = () => {
        if (!selectedId) return;
        setSaving(true);
        setTimeout(() => {
            localStorage.setItem('kiosk_society_id', selectedId);
            setSaving(false);
            navigate('/register');
        }, 800);
    };

    return (
        <div className="kiosk-setup-container">
            {/* Background Decorative Blur */}
            <div className="bg-blur top-right"></div>
            <div className="bg-blur bottom-left"></div>

            <div className="setup-card-wrapper">
                {/* Header Section */}
                <div className="setup-header">
                    <div className="setup-icon-box">
                        <Settings size={32} color="#FF5C2A" />
                    </div>
                    <h1 className="setup-title">Kiosk <span className="highlight">Setup</span></h1>
                    <p className="setup-subtitle">Configure this terminal for your society</p>
                </div>

                {/* Main Card Content */}
                <div className="setup-card">
                    <div className="selection-label-row">
                        <span className="selection-label">Select Society</span>
                        {!loading && <span className="count-badge">{societies.length} Available</span>}
                    </div>

                    {loading ? (
                        <div className="loading-state">
                            <Loader2 size={40} className="spin-icon" />
                            <p>Fetching societies...</p>
                        </div>
                    ) : (
                        <div className="societies-list custom-scrollbar">
                            {societies.map((society) => (
                                <button
                                    key={society.id}
                                    className={`society-item ${selectedId === society.id.toString() ? 'selected' : ''}`}
                                    onClick={() => setSelectedId(society.id.toString())}
                                >
                                    <div className="society-icon-wrapper">
                                        <Shield size={20} />
                                    </div>
                                    <div className="society-info">
                                        <div className="society-name">{society.name}</div>
                                        <div className="society-meta">
                                            <span>{society.type || 'Residential'}</span>
                                            <span className="dot"></span>
                                            <span>ID: {society.id}</span>
                                        </div>
                                    </div>
                                    <div className="selection-indicator">
                                        {selectedId === society.id.toString() && <Check size={14} />}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    <button
                        className="save-button"
                        onClick={handleSave}
                        disabled={!selectedId || saving}
                    >
                        {saving ? (
                            <>
                                <Loader2 size={20} className="spin-icon" />
                                <span>Finalizing...</span>
                            </>
                        ) : (
                            <>
                                <span>Connect Terminal</span>
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>

                    <button className="cancel-button" onClick={() => navigate('/register')}>
                        Cancel Initialization
                    </button>
                </div>

                {/* Info Footnote */}
                <div className="setup-info-box">
                    <div className="info-icon-wrapper">
                        <MapPin size={20} color="#FF5C2A" />
                    </div>
                    <p className="info-text">
                        This terminal will be <span className="highlight-text">permanently locked</span> to the selected society. Use the settings gear on the main form to return here.
                    </p>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .kiosk-setup-container {
                    min-height: 100vh;
                    background-color: #0a0f18;
                    color: #e2e8f0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 24px;
                    font-family: 'Inter', sans-serif;
                    position: relative;
                    overflow: hidden;
                }

                .bg-blur {
                    position: absolute;
                    width: 40%;
                    height: 40%;
                    background: radial-gradient(circle, rgba(255, 92, 42, 0.08) 0%, transparent 70%);
                    filter: blur(80px);
                    pointer-events: none;
                }

                .top-right { top: -10%; right: -10%; }
                .bottom-left { bottom: -10%; left: -10%; }

                .setup-card-wrapper {
                    max-width: 420px;
                    width: 100%;
                    position: relative;
                    z-index: 10;
                }

                .setup-header {
                    text-align: center;
                    margin-bottom: 40px;
                }

                .setup-icon-box {
                    width: 80px;
                    height: 80px;
                    background: #111827;
                    border: 1px solid rgba(255, 92, 42, 0.2);
                    border-radius: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 24px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                }

                .setup-title {
                    font-size: 32px;
                    font-weight: 800;
                    color: white;
                    margin-bottom: 8px;
                    letter-spacing: -0.5px;
                }

                .setup-title .highlight {
                    color: #FF5C2A;
                }

                .setup-subtitle {
                    color: #94a3b8;
                    font-weight: 500;
                }

                .setup-card {
                    background: rgba(17, 24, 39, 0.7);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 32px;
                    padding: 32px;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                }

                .selection-label-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 16px;
                }

                .selection-label {
                    text-transform: uppercase;
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 1px;
                    color: #64748b;
                }

                .count-badge {
                    font-size: 10px;
                    background: #1e293b;
                    color: #94a3b8;
                    padding: 2px 8px;
                    border-radius: 12px;
                }

                .loading-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 48px 0;
                    gap: 16px;
                }

                .spin-icon {
                    animation: spin 1s linear infinite;
                    color: #FF5C2A;
                }

                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                .societies-list {
                    margin-bottom: 32px;
                    max-height: 280px;
                    overflow-y: auto;
                    padding-right: 8px;
                }

                .society-item {
                    width: 100%;
                    background: rgba(30, 41, 59, 0.4);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 16px;
                    padding: 16px;
                    display: flex;
                    align-items: center;
                    margin-bottom: 12px;
                    transition: all 0.3s ease;
                    text-align: left;
                }

                .society-item:hover {
                    background: rgba(30, 41, 59, 0.6);
                    border-color: rgba(255, 255, 255, 0.1);
                }

                .society-item.selected {
                    background: rgba(255, 92, 42, 0.1);
                    border-color: #FF5C2A;
                }

                .society-icon-wrapper {
                    width: 44px;
                    height: 44px;
                    background: #1e293b;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 16px;
                    color: #475569;
                    transition: all 0.3s ease;
                }

                .selected .society-icon-wrapper {
                    background: #FF5C2A;
                    color: white;
                    box-shadow: 0 8px 16px rgba(255, 92, 42, 0.2);
                }

                .society-info {
                    flex: 1;
                }

                .society-name {
                    font-weight: 700;
                    font-size: 14px;
                    color: #f1f5f9;
                    margin-bottom: 2px;
                }

                .society-meta {
                    font-size: 11px;
                    color: #64748b;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .dot {
                    width: 3px;
                    height: 3px;
                    background: #334155;
                    border-radius: 50%;
                }

                .selection-indicator {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    border: 2px solid #1e293b;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                }

                .selected .selection-indicator {
                    background: #FF5C2A;
                    border-color: #FF5C2A;
                    color: white;
                }

                .save-button {
                    width: 100%;
                    background: linear-gradient(135deg, #FF5C2A 0%, #E64A19 100%);
                    color: white;
                    border: none;
                    border-radius: 16px;
                    padding: 16px;
                    font-weight: 700;
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    box-shadow: 0 10px 20px rgba(255, 92, 42, 0.2);
                    transition: all 0.3s ease;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 16px;
                }

                .save-button:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 15px 30px rgba(255, 92, 42, 0.3);
                }

                .save-button:disabled {
                    background: #1e293b;
                    color: #475569;
                    box-shadow: none;
                }

                .cancel-button {
                    width: 100%;
                    background: transparent;
                    border: none;
                    color: #475569;
                    font-size: 11px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    transition: color 0.3s;
                }

                .cancel-button:hover {
                    color: #94a3b8;
                }

                .setup-info-box {
                    margin-top: 40px;
                    display: flex;
                    gap: 16px;
                    padding: 20px;
                    background: rgba(255, 92, 42, 0.05);
                    border: 1px solid rgba(255, 92, 42, 0.1);
                    border-radius: 20px;
                }

                .info-text {
                    font-size: 11px;
                    color: #64748b;
                    line-height: 1.6;
                }

                .highlight-text {
                    color: #FF5C2A;
                    font-weight: 700;
                }

                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
            `}} />
        </div>
    );
};

export default KioskSetup;
