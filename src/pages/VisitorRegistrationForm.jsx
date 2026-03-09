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
        name: '', phone: '', flat: '', purpose: '', photo: null
    });
    const [touched, setTouched] = useState({});
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);

    const fileInputRef = useRef(null);
    const nameRef = useRef(null);
    const phoneRef = useRef(null);
    const flatRef = useRef(null);
    const purposeRef = useRef(null);

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

    const isFormValid = () => (
        formData.name && !validate('name', formData.name) &&
        formData.phone && !validate('phone', formData.phone) &&
        formData.flat && !validate('flat', formData.flat) &&
        formData.purpose && !validate('purpose', formData.purpose)
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {
            name: validate('name', formData.name),
            phone: validate('phone', formData.phone),
            flat: validate('flat', formData.flat),
            purpose: validate('purpose', formData.purpose),
        };
        setErrors(newErrors);
        setTouched({ name: true, phone: true, flat: true, purpose: true });

        if (Object.values(newErrors).some(Boolean)) {
            addNotification('Please correct the highlighted errors.', 'error');
            return;
        }

        setIsSubmitting(true);
        const loadingId = addNotification('Transmitting entry request…', 'loading', 0);
        try {
            const response = await apiService.registerVisitor(formData);
            removeNotification(loadingId);
            addNotification('Entry request sent! Waiting for resident approval.', 'success');
            setSubmitSuccess(true);
            setTimeout(() => {
                navigate('/waiting', {
                    state: {
                        flat: formData.flat,
                        requestId: response.data.requestId,
                        link: response.data.approvalLink,
                    }
                });
            }, 2500);
        } catch {
            removeNotification(loadingId);
            addNotification('Failed to send request. Please try again.', 'error');
            setIsSubmitting(false);
        }
    };

    const handlePhotoCapture = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setCapturedImage(reader.result);
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

    /* ════════ SUCCESS SCREEN ════════ */
    if (submitSuccess) {
        return (
            <div className="registration-page">
                <div className="sg-card sg-card--success">
                    <div className="sg-success-ring">
                        <CheckCircle2 size={48} color="#10b981" />
                    </div>
                    <h2 className="sg-success-title">Entry Request Sent</h2>
                    <p className="sg-success-desc">
                        A notification has been sent to the resident of{' '}
                        <strong>{formData.flat}</strong>. Please wait for approval.
                    </p>
                    <div className="sg-success-badge">
                        <ShieldCheck size={16} />
                        Resident Reviewing Your Request
                    </div>
                </div>
            </div>
        );
    }

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

                <form onSubmit={handleSubmit} noValidate>

                    {/* ── Visitor Name ── */}
                    <div className="sg-field">
                        <label className="sg-label">Visitor Full Name</label>
                        {/* 
                          FLEX ROW approach — icon is a flex child, NOT inside input.
                          input has no padding-left padding override issues.
                        */}
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
                            {/* Dropdown chevron only when no status icon */}
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

                    {/* ── Photo capture ── */}
                    <div
                        className={`sg-photo ${capturedImage ? 'sg-photo--filled' : ''}`}
                        onClick={() => fileInputRef.current?.click()}
                        role="button"
                        tabIndex={0}
                        onKeyDown={e => e.key === 'Enter' && fileInputRef.current?.click()}
                    >
                        {capturedImage ? (
                            <>
                                <img src={capturedImage} alt="Visitor" className="sg-photo-preview" />
                                <div>
                                    <div className="sg-photo-title" style={{ color: '#2563eb' }}>Photo captured ✓</div>
                                    <div className="sg-photo-sub">Tap to retake</div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="sg-photo-icon">
                                    <Camera size={20} color="#2563eb" />
                                </div>
                                <div>
                                    <div className="sg-photo-title">
                                        Visitor Photo{' '}
                                        <span style={{ fontWeight: 400, color: '#9ca3af' }}>(Optional)</span>
                                    </div>
                                    <div className="sg-photo-sub">Tap to capture for faster verification</div>
                                </div>
                            </>
                        )}
                        <input
                            type="file" accept="image/*" capture="user"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handlePhotoCapture}
                        />
                    </div>

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

                </form>
            </div>
        </div>
    );
}
