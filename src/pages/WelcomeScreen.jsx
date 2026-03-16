import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Clock } from 'lucide-react';

export default function WelcomeScreen() {
    const navigate = useNavigate();
    const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="gateway-root">
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');

                    .gateway-root {
                        min-height: 100vh;
                        width: 100vw;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        background: #F4F4F4;
                        font-family: 'Outfit', sans-serif;
                        padding: 20px;
                        margin: 0;
                        overflow: hidden;
                    }

                    .main-card {
                        background: #FFFFFF;
                        width: 100%;
                        max-width: 500px;
                        border-radius: 24px;
                        position: relative;
                        padding: 60px 40px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        text-align: center;
                        box-shadow: 0 10px 40px rgba(0,0,0,0.03);
                    }

                    .time-indicator {
                        position: absolute;
                        top: 24px;
                        right: 24px;
                        background: #F1F5F9;
                        padding: 6px 12px;
                        border-radius: 100px;
                        display: flex;
                        align-items: center;
                        gap: 6px;
                        font-size: 13px;
                        font-weight: 600;
                        color: #475569;
                    }

                    .icon-box {
                        width: 80px;
                        height: 80px;
                        background: #FFF1EE;
                        border-radius: 18px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-bottom: 30px;
                    }

                    .system-label {
                        color: #FF5C2A;
                        font-size: 11px;
                        font-weight: 800;
                        letter-spacing: 0.15em;
                        margin-bottom: 20px;
                        text-transform: uppercase;
                    }

                    .welcome-title {
                        font-size: 42px;
                        font-weight: 800;
                        color: #1E293B;
                        line-height: 1.1;
                        margin-bottom: 24px;
                    }

                    .welcome-text {
                        color: #64748B;
                        font-size: 16px;
                        line-height: 1.6;
                        margin-bottom: 45px;
                        max-width: 320px;
                    }

                    .start-button {
                        width: 100%;
                        background: #FF5C2A;
                        color: #FFFFFF;
                        border: none;
                        padding: 20px;
                        border-radius: 100px;
                        font-size: 16px;
                        font-weight: 800;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 10px;
                        cursor: pointer;
                        transition: transform 0.2s, background 0.2s;
                        box-shadow: 0 12px 24px rgba(255, 92, 42, 0.3);
                    }

                    .start-button:hover {
                        background: #F97316;
                        transform: translateY(-2px);
                    }

                    .start-button:active {
                        transform: translateY(0);
                    }

                    @media (max-width: 480px) {
                        .main-card {
                            padding: 50px 24px;
                        }
                        .welcome-title {
                            font-size: 32px;
                        }
                    }
                `}
            </style>

            <div className="main-card">
                <div className="time-indicator">
                    <Clock size={14} /> {time}
                </div>

                <div className="icon-box">
                    <ShieldCheck size={40} color="#FF5C2A" strokeWidth={1.5} />
                </div>

                <div className="system-label">Smart Visitor Access System</div>
                
                <h1 className="welcome-title">
                    Welcome to<br />SecureGate
                </h1>

                <p className="welcome-text">
                    Tap below to securely register your visit and request resident approval.
                </p>

                <button className="start-button" onClick={() => navigate('/register')}>
                    START VISITOR ENTRY <ArrowRight size={20} strokeWidth={2.5} />
                </button>
            </div>
        </div>
    );
}

