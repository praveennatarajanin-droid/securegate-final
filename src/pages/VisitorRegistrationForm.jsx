import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../components/NotificationProvider';
import { apiService } from '../services/apiService';
import { ChevronLeft, Send, User, Phone, Home, Briefcase, Camera, ShieldCheck, CheckCircle2, AlertCircle, Loader2, ChevronDown } from 'lucide-react';
import '../styles/visitor-form.css';

export default function VisitorRegistrationForm() {
    const navigate = useNavigate();
    const { addNotification, removeNotification } = useNotification();

    const [formData, setFormData] = useState({ name: '', phone: '', flat: '', purpose: '', photo: null });
    const [touched, setTouched] = useState({});
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);

    const fileInputRef = useRef(null);

    // Auto-focus next field
    const nameRef = useRef(null);
    const phoneRef = useRef(null);
    const flatRef = useRef(null);
    const purposeRef = useRef(null);

    const validate = (name, value) => {
        let error = '';
        switch (name) {
            case 'name':
                if (!value) error = 'Visitor name is required';
                else if (value.length < 3) error = 'Minimum 3 characters required';
                else if (!/^[a-zA-Z\s]+$/.test(value)) error = 'Only letters allowed';
                break;
            case 'phone':
                if (!value) error = 'Phone number is required';
                else if (!/^\d{10}$/.test(value)) error = 'Exactly 10 digits required';
                break;
            case 'flat':
                if (!value) error = 'Flat/House number is required';
                else if (!/^[A-Z]-\d{3}$/.test(value) && !/^[A-Z]\d{3}$/.test(value) && value.length < 2) error = 'Format: A-101 or B-205';
                break;
            case 'purpose':
                if (!value) error = 'Please select a purpose';
                break;
            default:
                break;
        }
        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (touched[name]) {
            setErrors({ ...errors, [name]: validate(name, value) });
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched({ ...touched, [name]: true });
        setErrors({ ...errors, [name]: validate(name, value) });
    };

    const isFormValid = () => {
        return (
            formData.name && !validate('name', formData.name) &&
            formData.phone && !validate('phone', formData.phone) &&
            formData.flat && !validate('flat', formData.flat) &&
            formData.purpose && !validate('purpose', formData.purpose)
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {
            name: validate('name', formData.name),
            phone: validate('phone', formData.phone),
            flat: validate('flat', formData.flat),
            purpose: validate('purpose', formData.purpose)
        };

        setErrors(newErrors);
        setTouched({ name: true, phone: true, flat: true, purpose: true });

        if (Object.values(newErrors).some(err => err)) {
            addNotification('Please correct form errors.', 'error');
            return;
        }

        setIsSubmitting(true);
        const loadingId = addNotification('Transmitting entry request...', 'loading', 0);

        try {
            const response = await apiService.registerVisitor(formData);
            removeNotification(loadingId);
            addNotification('Entry request sent successfully!', 'success');
            setSubmitSuccess(true);

            setTimeout(() => {
                navigate('/waiting', {
                    state: {
                        flat: formData.flat,
                        requestId: response.data.requestId,
                        link: response.data.approvalLink
                    }
                });
            }, 3000);
        } catch (err) {
            removeNotification(loadingId);
            addNotification('Failed to send request. Try again.', 'error');
            setIsSubmitting(false);
        }
    };

    const getInputStatusClass = (name) => {
        if (!touched[name]) return '';
        return errors[name] ? 'invalid' : 'valid';
    };

    const handlePhotoCapture = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCapturedImage(reader.result);
                setFormData({ ...formData, photo: reader.result });
                addNotification('Photo captured successfully', 'success');
            };
            reader.readAsDataURL(file);
        }
    };

    if (submitSuccess) {
        return (
            <div className="registration-container">
                <div className="glass-card approval-indicator">
                    <div className="ripple-circle success">
                        <CheckCircle2 size={40} color="var(--color-success)" />
                    </div>
                    <h2 style={{ color: 'var(--color-success-text)' }}>Entry Request Sent</h2>
                    <p style={{ color: 'var(--color-text-muted)', marginTop: '1rem', lineHeight: 1.6 }}>
                        A notification has been sent to the resident of <strong>{formData.flat}</strong>.<br />
                        Please wait for approval.
                    </p>
                    <div className="success-badge" style={{ marginTop: '2rem', padding: '0.75rem 1.5rem', background: 'var(--color-success-light)', color: 'var(--color-success-text)', borderRadius: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ShieldCheck size={20} /> Resident Reviewing Request
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="registration-container">
            <div className="glass-card">
                <div className="trust-badge">
                    <ShieldCheck size={16} />
                    <span>SecureGate Encrypted Entry</span>
                </div>

                <div className="form-header">
                    <button type="button" className="back-btn" onClick={() => navigate('/')}>
                        <ChevronLeft size={24} />
                    </button>
                    <h2 className="header-title">Visitor Entry</h2>
                    <div style={{ width: '40px' }}></div>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    <div className="input-wrapper">
                        <label className="input-label">Visitor Full Name</label>
                        <div style={{ position: 'relative' }}>
                            <User size={20} className="input-icon" />
                            <input
                                ref={nameRef}
                                type="text"
                                name="name"
                                className={`input-field ${getInputStatusClass('name')}`}
                                value={formData.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Enter name"
                                autoComplete="off"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        phoneRef.current?.focus();
                                    }
                                }}
                            />
                            {touched.name && (
                                errors.name ?
                                    <AlertCircle size={18} className="input-status" color="var(--color-error)" /> :
                                    <CheckCircle2 size={18} className="input-status" color="var(--color-success)" />
                            )}
                        </div>
                        {touched.name && errors.name && <span className="error-message"><AlertCircle size={14} /> {errors.name}</span>}
                    </div>

                    <div className="input-wrapper">
                        <label className="input-label">Phone Number</label>
                        <div style={{ position: 'relative' }}>
                            <Phone size={20} className="input-icon" />
                            <input
                                ref={phoneRef}
                                type="tel"
                                name="phone"
                                className={`input-field ${getInputStatusClass('phone')}`}
                                value={formData.phone}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="10-digit mobile number"
                                autoComplete="off"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        flatRef.current?.focus();
                                    }
                                }}
                            />
                            {touched.phone && (
                                errors.phone ?
                                    <AlertCircle size={18} className="input-status" color="var(--color-error)" /> :
                                    <CheckCircle2 size={18} className="input-status" color="var(--color-success)" />
                            )}
                        </div>
                        {touched.phone && errors.phone && <span className="error-message"><AlertCircle size={14} /> {errors.phone}</span>}
                    </div>

                    <div className="input-wrapper">
                        <label className="input-label">Flat / House Number</label>
                        <div style={{ position: 'relative' }}>
                            <Home size={20} className="input-icon" />
                            <input
                                ref={flatRef}
                                type="text"
                                name="flat"
                                className={`input-field ${getInputStatusClass('flat')}`}
                                value={formData.flat}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="e.g. A-101"
                                autoComplete="off"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        purposeRef.current?.focus();
                                    }
                                }}
                            />
                            {touched.flat && (
                                errors.flat ?
                                    <AlertCircle size={18} className="input-status" color="var(--color-error)" /> :
                                    <CheckCircle2 size={18} className="input-status" color="var(--color-success)" />
                            )}
                        </div>
                        {touched.flat && errors.flat && <span className="error-message"><AlertCircle size={14} /> {errors.flat}</span>}
                    </div>

                    <div className="input-wrapper">
                        <label className="input-label">Visit Purpose</label>
                        <div style={{ position: 'relative' }}>
                            <Briefcase size={20} className="input-icon" />
                            <select
                                ref={purposeRef}
                                name="purpose"
                                className={`input-field ${getInputStatusClass('purpose')}`}
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
                            <ChevronDown size={20} className="select-arrow" />
                            {touched.purpose && (
                                errors.purpose ?
                                    <AlertCircle size={18} className="input-status" color="var(--color-error)" /> :
                                    <CheckCircle2 size={18} className="input-status" color="var(--color-success)" />
                            )}
                        </div>
                        {touched.purpose && errors.purpose && <span className="error-message"><AlertCircle size={14} /> {errors.purpose}</span>}
                    </div>

                    <div
                        className="photo-capture"
                        onClick={() => fileInputRef.current?.click()}
                        style={{ borderStyle: capturedImage ? 'solid' : 'dashed', borderColor: capturedImage ? 'var(--color-primary)' : 'var(--color-border)' }}
                    >
                        {capturedImage ? (
                            <>
                                <img src={capturedImage} alt="Visitor" className="photo-preview" />
                                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary)' }}>Tap to retake photo</span>
                            </>
                        ) : (
                            <>
                                <Camera size={32} color="var(--color-primary-light)" />
                                <div>
                                    <h4 style={{ color: 'var(--color-text)', marginBottom: '0.25rem' }}>Visitor Photo (Recommended)</h4>
                                    <span style={{ fontSize: '0.825rem' }}>Snapshot for faster verification</span>
                                </div>
                            </>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            capture="user"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handlePhotoCapture}
                        />
                    </div>

                    <button
                        type="submit"
                        className={`submit-btn ${isSubmitting ? 'loading' : ''} ${!isFormValid() ? 'disabled' : ''}`}
                        disabled={isSubmitting || !isFormValid()}
                        style={{ marginTop: '1rem' }}
                    >
                        {isSubmitting ? (
                            <>Sending Request <Loader2 size={24} className="spinner" /></>
                        ) : (
                            <>Send Entry Request <Send size={20} /></>
                        )}
                    </button>
                    <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '1.5rem' }}>
                        By clicking send, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </form>
            </div>
        </div>
    );
}
