import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    ShieldCheck, Loader2, CheckCircle2, XCircle,
    Camera, CameraOff, Eye, Home, Clock
} from 'lucide-react';
import '../styles/visitor-form.css';
import '../styles/waiting-screen.css';

export default function ApprovalWaitingScreen() {
    const navigate = useNavigate();
    const location = useLocation();

    const visitorFlat = location.state?.flat || 'A-101';
    const visitorName = location.state?.name || '';

    // status: 'waiting' | 'approved' | 'denied'
    const [status, setStatus] = useState('waiting');
    const [cameraError, setCameraError] = useState(false);
    const [dots, setDots] = useState('');
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    /* ── Animated dots ── */
    useEffect(() => {
        const id = setInterval(() => {
            setDots(d => d.length >= 3 ? '' : d + '.');
        }, 500);
        return () => clearInterval(id);
    }, []);

    /* ── Start live camera ── */
    useEffect(() => {
        let cancelled = false;
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }
                });
                if (cancelled) { stream.getTracks().forEach(t => t.stop()); return; }
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch {
                if (!cancelled) setCameraError(true);
            }
        };
        startCamera();
        return () => {
            cancelled = true;
            streamRef.current?.getTracks().forEach(t => t.stop());
        };
    }, []);

    /* ── Simulate resident approval after 7 seconds (demo) ──
       Replace with real polling / websocket logic when backend is ready */
    useEffect(() => {
        if (status !== 'waiting') return;

        // Demo: auto-approve after 7 seconds
        const approveTimer = setTimeout(() => {
            setStatus('approved');
        }, 7000);

        return () => clearTimeout(approveTimer);
    }, [status]);

    /* ── After approval/denial stop camera & navigate ── */
    useEffect(() => {
        if (status === 'approved') {
            // stop camera — visitor sees success screen
            streamRef.current?.getTracks().forEach(t => t.stop());
            const timer = setTimeout(() => navigate('/gate', { state: location.state }), 4000);
            return () => clearTimeout(timer);
        }
        if (status === 'denied') {
            streamRef.current?.getTracks().forEach(t => t.stop());
            const timer = setTimeout(() => navigate('/'), 5000);
            return () => clearTimeout(timer);
        }
    }, [status, navigate, location.state]);

    /* ════════════════ APPROVED SCREEN ════════════════ */
    if (status === 'approved') {
        return (
            <div className="waiting-page">
                <div className="waiting-card outcome-card approved-card">
                    <div className="outcome-icon-wrap approved">
                        <div className="pulse-ring" />
                        <div className="pulse-ring delay" />
                        <CheckCircle2 size={56} color="#10b981" className="outcome-icon" />
                    </div>

                    <h1 className="outcome-title approved-title">Entry Approved</h1>
                    <p className="outcome-subtitle">Welcome! The gate is opening for you.</p>

                    <div className="gate-animation">
                        <div className="gate-left" />
                        <div className="gate-right" />
                        <span className="gate-label">GATE OPENING</span>
                    </div>

                    <div className="outcome-info-box approved-info">
                        <ShieldCheck size={16} />
                        <span>Identity verified by resident — proceed to the gate</span>
                    </div>
                </div>
            </div>
        );
    }

    /* ════════════════ DENIED SCREEN ════════════════ */
    if (status === 'denied') {
        return (
            <div className="waiting-page">
                <div className="waiting-card outcome-card denied-card">
                    <div className="outcome-icon-wrap denied">
                        <XCircle size={56} color="#ef4444" className="outcome-icon" />
                    </div>

                    <h1 className="outcome-title denied-title">Entry Denied</h1>
                    <p className="outcome-subtitle">The resident declined your entry request.</p>

                    <div className="outcome-info-box denied-info">
                        <span>Please contact the resident directly or visit the front desk for assistance.</span>
                    </div>

                    <p className="outcome-redirect">Returning to home screen{dots}</p>
                </div>
            </div>
        );
    }

    /* ════════════════ WAITING SCREEN (with camera) ════════════════ */
    return (
        <div className="waiting-page">
            <div className="waiting-card">

                {/* ── Header ── */}
                <div className="waiting-badge">
                    <Loader2 size={13} className="badge-spinner" />
                    <span>Awaiting Resident Approval</span>
                </div>

                {/* ── Live Camera Section ── */}
                <div className="camera-section">
                    <div className="camera-frame">
                        {cameraError ? (
                            <div className="camera-error">
                                <CameraOff size={32} color="#94a3b8" />
                                <span>Camera unavailable</span>
                                <span className="camera-error-sub">Resident will be notified via app</span>
                            </div>
                        ) : (
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="camera-video"
                            />
                        )}

                        {/* LIVE badge */}
                        {!cameraError && (
                            <div className="live-badge">
                                <span className="live-dot" />
                                LIVE
                            </div>
                        )}

                        {/* Corner guides */}
                        <div className="corner tl" /><div className="corner tr" />
                        <div className="corner bl" /><div className="corner br" />
                    </div>

                    {/* Camera instruction */}
                    <div className="camera-instruction">
                        <Eye size={14} />
                        <span>Please look clearly into the camera</span>
                    </div>
                </div>

                {/* ── Status ── */}
                <div className="waiting-status">
                    <h2 className="waiting-title">Waiting for Approval{dots}</h2>
                    <p className="waiting-desc">
                        Your entry request has been sent to the resident at{' '}
                        <strong>Flat {visitorFlat}</strong>.
                    </p>
                </div>

                {/* ── Instructions ── */}
                <div className="waiting-instructions">
                    <div className="instruction-item">
                        <div className="instruction-num">1</div>
                        <span>Stand in front of the camera and face forward</span>
                    </div>
                    <div className="instruction-item">
                        <div className="instruction-num">2</div>
                        <span>The resident is reviewing your identity via live feed</span>
                    </div>
                    <div className="instruction-item">
                        <div className="instruction-num">3</div>
                        <span>Do not move away — wait for the gate to open</span>
                    </div>
                </div>

                {/* ── Details row ── */}
                <div className="waiting-meta">
                    <div className="meta-chip">
                        <Home size={13} />
                        <span>Flat {visitorFlat}</span>
                    </div>
                    <div className="meta-chip">
                        <Clock size={13} />
                        <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
