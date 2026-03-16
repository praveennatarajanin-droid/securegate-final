import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../components/NotificationProvider';
import { apiService } from '../services/apiService';
import {
    ChevronLeft, Send, User, Phone, Home, Briefcase,
    Camera, ShieldCheck, CheckCircle2, AlertCircle,
    Loader2, ChevronDown, Lock
} from 'lucide-react';
import '../styles/visitor-form.css';

export default function VisitorRegistrationForm() {
    const navigate = useNavigate();
    const { addNotification, removeNotification } = useNotification();

    const [formData, setFormData] = useState({
        name: '', phone: '', flat: '', purpose: '', customPurpose: '', photo: null
    });
    const [touched, setTouched] = useState({});
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const nameRef = useRef(null);
    const phoneRef = useRef(null);
    const flatRef = useRef(null);
    const purposeRef = useRef(null);

    React.useEffect(() => {
        const startCamera = async () => {
            if (!window.isSecureContext && window.location.protocol === 'http:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
                window.location.href = window.location.href.replace('http:', 'https:');
                return;
            }

            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                console.error("MediaDevices not supported. Use HTTPS!");
                addNotification("Camera requires HTTPS. Please ensure the URL starts with https://", "error");
                return;
            }
            try {
                let stream = window.lastActiveStream;

                // Safely check if stream is dead or missing
                const isDead = !stream || stream.getTracks().every(t => t.readyState === 'ended');

                if (isDead) {
                    window.cameraPromise = navigator.mediaDevices.getUserMedia({
                        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }
                    });
                    try {
                        stream = await window.cameraPromise;
                        window.lastActiveStream = stream;
                    } catch (e) {
                        window.cameraPromise = null;
                        throw e;
                    }
                }
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Tablet camera access failed:", err);
                addNotification("Failed to access camera. Please check permissions.", "error");
            }
        };
        startCamera();

        return () => {
            // Unmount handling
        };
    }, []);

    /* ── Validation ── */
    const validate = (name, value) => {
        switch (name) {
            case 'name':
                if (!value.trim()) return 'Visitor name is required';
                if (value.trim().length < 3) return 'Minimum 3 characters required';
                if (!/^[a-zA-Z\s]+$/.test(value)) return 'Only letters and spaces allowed';
                return '';
            case 'phone':
                if (!value) return 'Phone number is required';
                if (!/^\d{10}$/.test(value)) return 'Exactly 10 digits required';
                return '';
            case 'flat':
                if (!value.trim()) return 'Flat / House number is required';
                if (value.trim().length < 2) return 'E.g. A-101 or B-205';
                return '';
            case 'purpose':
                if (!value) return 'Please select a purpose';
                return '';
            case 'customPurpose':
                if (formData.purpose === 'Other' && !value.trim()) return 'Please specify your purpose';
                return '';
            default: return '';
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (touched[name]) setErrors(prev => ({ ...prev, [name]: validate(name, value) }));
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        setErrors(prev => ({ ...prev, [name]: validate(name, value) }));
    };

    const isFormValid = () => {
        const baseValid = formData.name && !validate('name', formData.name) &&
            formData.phone && !validate('phone', formData.phone) &&
            formData.flat && !validate('flat', formData.flat) &&
            formData.purpose && !validate('purpose', formData.purpose);

        if (!baseValid) return false;
        if (formData.purpose === 'Other') {
            return formData.customPurpose && !validate('customPurpose', formData.customPurpose);
        }
        return true;
    };

    const capturePhoto = () => {
        if (!videoRef.current) return null;
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/jpeg', 0.8);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Capture photo first
        const photoData = capturePhoto();
        
        const newErrors = {
            name: validate('name', formData.name),
            phone: validate('phone', formData.phone),
            flat: validate('flat', formData.flat),
            purpose: validate('purpose', formData.purpose),
        };
        if (formData.purpose === 'Other') {
            newErrors.customPurpose = validate('customPurpose', formData.customPurpose);
            setTouched({ name: true, phone: true, flat: true, purpose: true, customPurpose: true });
        } else {
            setTouched({ name: true, phone: true, flat: true, purpose: true });
        }
        setErrors(newErrors);

        if (Object.values(newErrors).some(Boolean)) {
            addNotification('Please correct the highlighted errors.', 'error');
            return;
        }

        setIsSubmitting(true);
        const loadingId = addNotification('Transmitting entry request…', 'loading', 0);
        try {
            const payload = {
                ...formData,
                photo: photoData, // Add the captured photo
                purpose: formData.purpose === 'Other' ? formData.customPurpose : formData.purpose
            };
            const response = await apiService.registerVisitor(payload);
            removeNotification(loadingId);
            addNotification('Entry request sent! Waiting for resident approval.', 'success');
            setSubmitSuccess(true);

            setTimeout(() => {
                // Clear form data and reset success state before navigating
                setFormData({
                    name: '', phone: '', flat: '', purpose: '', customPurpose: '', photo: null
                });
                setTouched({});
                setErrors({});
                setSubmitSuccess(false);
                setIsSubmitting(false);
                
                // Navigate to the waiting screen
                navigate(`/waiting/${response.data.requestId}`, { state: { flat: payload.flat, requestId: response.data.requestId } });
            }, 3000);
        } catch (err) {
            removeNotification(loadingId);
            addNotification('Failed to send request: ' + (err.message || 'Unknown error'), 'error');
            setIsSubmitting(false);
        }
    };

    const handlePhotoCapture = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prev => ({ ...prev, photo: reader.result }));
            addNotification('Photo captured!', 'success');
        };
        reader.readAsDataURL(file);
    };

    /* ── State class for the wrapper border ── */
    const wrapperState = (name) => {
        if (!touched[name]) return '';
        return errors[name] ? 'field-error' : 'field-valid';
    };

    /* ── Right-side status icon ── */
    const StatusIcon = ({ field }) => {
        if (!touched[field]) return null;
        return errors[field]
            ? <AlertCircle size={17} style={{ color: '#ef4444', flexShrink: 0 }} />
            : <CheckCircle2 size={17} style={{ color: '#10b981', flexShrink: 0 }} />;
    };

    /* (Success screen is now rendered inside the main return to preserve the video node) */

    /* ════════ MAIN FORM ════════ */
    return (
        <div className="registration-page">
            <div className="sg-card">

                {/* ── Trust badge ── */}
                <div className="sg-trust">
                    <Lock size={12} />
                    <span>SecureGate · Encrypted Entry</span>
                </div>

                {/* ── Header row ── */}
                {!submitSuccess && (
                    <div className="sg-header">
                        <button
                            type="button"
                            className="sg-back"
                            onClick={() => navigate('/')}
                            aria-label="Go back"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <h2 className="sg-title">Visitor Entry</h2>
                        <div className="sg-spacer" />
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate>

                    <div style={{ display: submitSuccess ? 'none' : 'block' }}>
                        {/* ── Visitor Name ── */}
                        <div className="sg-field">
                            <label className="sg-label">Visitor Full Name</label>
                            <div className={`sg-input-row ${wrapperState('name')}`}>
                                <span className="sg-icon"><User size={18} /></span>
                                <input
                                    ref={nameRef}
                                    type="text"
                                    name="name"
                                    className="sg-input"
                                    value={formData.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Enter full name"
                                    autoComplete="off"
                                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), phoneRef.current?.focus())}
                                />
                                <span className="sg-status"><StatusIcon field="name" /></span>
                            </div>
                            {touched.name && errors.name && (
                                <span className="sg-error">
                                    <AlertCircle size={12} />{errors.name}
                                </span>
                            )}
                        </div>

                        {/* ── Phone Number ── */}
                        <div className="sg-field">
                            <label className="sg-label">Phone Number</label>
                            <div className={`sg-input-row ${wrapperState('phone')}`}>
                                <span className="sg-icon"><Phone size={18} /></span>
                                <input
                                    ref={phoneRef}
                                    type="tel"
                                    name="phone"
                                    className="sg-input"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="10-digit mobile number"
                                    autoComplete="off"
                                    maxLength={10}
                                    inputMode="numeric"
                                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), flatRef.current?.focus())}
                                />
                                <span className="sg-status"><StatusIcon field="phone" /></span>
                            </div>
                            {touched.phone && errors.phone && (
                                <span className="sg-error">
                                    <AlertCircle size={12} />{errors.phone}
                                </span>
                            )}
                        </div>

                        {/* ── Flat / House Number ── */}
                        <div className="sg-field">
                            <label className="sg-label">Flat / House Number</label>
                            <div className={`sg-input-row ${wrapperState('flat')}`}>
                                <span className="sg-icon"><Home size={18} /></span>
                                <input
                                    ref={flatRef}
                                    type="text"
                                    name="flat"
                                    className="sg-input"
                                    value={formData.flat}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="e.g. A-101 or B-205"
                                    autoComplete="off"
                                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), purposeRef.current?.focus())}
                                />
                                <span className="sg-status"><StatusIcon field="flat" /></span>
                            </div>
                            {touched.flat && errors.flat && (
                                <span className="sg-error">
                                    <AlertCircle size={12} />{errors.flat}
                                </span>
                            )}
                        </div>

                        {/* ── Purpose of Visit ── */}
                        <div className="sg-field">
                            <label className="sg-label">Purpose of Visit</label>
                            <div className={`sg-input-row ${wrapperState('purpose')}`}>
                                <span className="sg-icon"><Briefcase size={18} /></span>
                                <select
                                    ref={purposeRef}
                                    name="purpose"
                                    className="sg-input sg-select"
                                    value={formData.purpose}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                >
                                    <option value="" disabled>Select purpose</option>
                                    <option value="Delivery">Delivery / Courier</option>
                                    <option value="Guest">Guest / Friend</option>
                                    <option value="Maintenance">Maintenance / Service</option>
                                    <option value="Other">Other</option>
                                </select>
                                {!touched.purpose && (
                                    <span className="sg-status sg-chevron"><ChevronDown size={16} /></span>
                                )}
                                {touched.purpose && (
                                    <span className="sg-status"><StatusIcon field="purpose" /></span>
                                )}
                            </div>
                            {touched.purpose && errors.purpose && (
                                <span className="sg-error">
                                    <AlertCircle size={12} />{errors.purpose}
                                </span>
                            )}
                        </div>

                        {/* ── Custom Purpose (If Other) ── */}
                        {formData.purpose === 'Other' && (
                            <div className="sg-field" style={{ animation: 'sgFadeUp 0.3s ease-out' }}>
                                <label className="sg-label">Specify Purpose</label>
                                <div className={`sg-input-row ${wrapperState('customPurpose')}`}>
                                    <span className="sg-icon"><Briefcase size={18} /></span>
                                    <input
                                        type="text"
                                        name="customPurpose"
                                        className="sg-input"
                                        value={formData.customPurpose}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="What is the purpose of your visit?"
                                        autoComplete="off"
                                    />
                                    <span className="sg-status"><StatusIcon field="customPurpose" /></span>
                                </div>
                                {touched.customPurpose && errors.customPurpose && (
                                    <span className="sg-error">
                                        <AlertCircle size={12} />{errors.customPurpose}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ── Submit Success Message Display ── */}
                    {submitSuccess && (
                        <div style={{ textAlign: 'center', marginBottom: '1.5rem', background: 'transparent' }}>
                            <div className="sg-success-ring" style={{ margin: '0 auto 1rem' }}>
                                <CheckCircle2 size={48} color="#10b981" />
                            </div>
                            <h2 className="sg-success-title">Entry Request Sent</h2>
                            <p className="sg-success-desc">
                                A notification has been sent to the resident of{' '}
                                <strong>{formData.flat}</strong>. Please wait.
                            </p>
                        </div>
                    )}

                    {/* ── Tablet Live Camera Preview ── */}
                    {!submitSuccess && (
                        <div className="sg-field">
                            <label className="sg-label">Live Gate Camera</label>
                            <div style={{ position: 'relative', width: '100%', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#e2e8f0', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '180px' }}>
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <span style={{ width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%', display: 'inline-block' }}></span>
                                    LIVE
                                </div>
                            </div>
                            <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '6px', textAlign: 'center' }}>
                                This live video will be sent to the resident for verification.
                            </p>
                        </div>
                    )}

                    {submitSuccess && (
                        <div className="sg-success-badge" style={{ marginTop: '1rem', justifyContent: 'center' }}>
                            <ShieldCheck size={16} />
                            Resident Reviewing Your Request
                        </div>
                    )}

                    {!submitSuccess && (
                        <>
                            {/* ── Submit button ── */}
                            <button
                                type="submit"
                                className="sg-submit"
                                disabled={isSubmitting || !isFormValid()}
                                data-loading={isSubmitting}
                                data-disabled={!isFormValid()}
                            >
                                {isSubmitting ? (
                                    <><Loader2 size={20} className="sg-spin" /> Sending Request…</>
                                ) : (
                                    <>Send Entry Request <Send size={17} /></>
                                )}
                            </button>

                            <p className="sg-legal">
                                By submitting, you agree to our Terms of Service and Privacy Policy.
                            </p>
                        </>
                    )}

                </form>
            </div>
        </div>
    );
}
