import { Api } from "@/api/api.ts";
import "../assets/styles/LoginPage.css";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

function SignUpPage() {
    const [formData, setFormData] = useState({
        name: '',
        lastname: '',
        email: '',
        phone: '',
        birthday: '',
        address: '',
        password: ''
    });
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false);
    const [showOtp, setShowOtp] = useState(false);
    const { toast } = useToast();
    const api = Api.getInstance();

    const checkData = (data: any) => {
        return (data.name &&
            data.lastname &&
            data.email &&
            data.phone &&
            data.birthday &&
            data.address &&
            data.password);
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!checkData(formData)) {
            toast({
                title: "Error!",
                description: "You have to complete all the fields!",
            });
            return;
        }

        if (formData.password !== confirmPassword) {
            toast({
                title: "Error!",
                description: 'Passwords do not match!',
            });
            return;
        }

        if (formData.password.length < 6) {
            toast({
                title: "Error!",
                description: 'Password must be at least 6 characters!',
            });
            return;
        }

        if (formData.birthday) {
            const birthDate = new Date(formData.birthday);
            const today = new Date();
            var age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();

            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }

            if (age < 13) {
                toast({
                    title: "Error!",
                    description: 'You must be at least 13 years old to sign up!',
                });
                return;
            }
        }

        setIsLoading(true);

        try {
            const response = await api.post('/auth/register', formData);
            if (response.status === 200) {
                setShowOtp(true);
            } else {
                toast({
                    title: "Error!",
                    description: response.data.message,
                });
            }
        } catch (error) {
            toast({
                title: "Error!",
                description: error.response?.data?.message || "Sign up failed. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (showOtp) {
        return <OtpPage email={formData.email} />;
    }

    return (
        <div className="login-page">
            <div className="login-container" style={{ maxWidth: '550px' }}>
                <div className="login-card">
                    <header className="login-header">
                        <h1 className="login-title">Create Account</h1>
                    </header>

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="name-fields">
                            <div className="input-group">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="First Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="text-input"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="input-group">
                                <input
                                    type="text"
                                    name="lastname"
                                    placeholder="Last Name"
                                    value={formData.lastname}
                                    onChange={handleChange}
                                    className="text-input"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                className="text-input"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="input-group">
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Phone Number"
                                value={formData.phone}
                                onChange={handleChange}
                                className="text-input"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="input-group">
                            <input
                                type="date"
                                name="birthday"
                                placeholder="Birthday"
                                value={formData.birthday}
                                onChange={handleChange}
                                className="text-input"
                                required
                                disabled={isLoading}
                                max={new Date().toISOString().split('T')[0]}
                            />
                        </div>

                        <div className="input-group">
                            <textarea
                                name="address"
                                placeholder="Full Address"
                                value={formData.address}
                                onChange={handleChange}
                                className="text-input address-input"
                                required
                                disabled={isLoading}
                                rows={3}
                            />
                        </div>

                        <div className="input-group">
                            <input
                                name="password"
                                type="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="text-input"
                                required
                                disabled={isLoading}
                                minLength={6}
                            />
                        </div>

                        <div className="input-group">
                            <input
                                name="confirmPassword"
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(event) => setConfirmPassword(event.target.value)}
                                className="text-input"
                                required
                                disabled={isLoading}
                                minLength={6}
                            />
                        </div>

                        <div className="password-requirements">
                            <p className="requirements-text">
                                Password must be at least 6 characters long.
                            </p>
                        </div>

                        <button
                            type="submit"
                            className={`login-btn ${isLoading ? 'loading' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="btn-loading">
                                    <span className="spinner"></span>
                                    Creating Account...
                                </span>
                            ) : (
                                'Sign Up'
                            )}
                        </button>

                        <div className="login-redirect">
                            <p>
                                Already have an account? <a href="/login" className="forgot-link">Sign In</a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

function OtpPage({ email }) {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const { toast } = useToast();
    const api = Api.getInstance();

    const handleOtpChange = (index, value) => {
        if (value.length <= 1 && /^\d*$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Auto-focus next input
            if (value !== '' && index < 5) {
                const nextInput = document.getElementById(`otp-${index + 1}`);
                if (nextInput) nextInput.focus();
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const otpValue = otp.join('');

        if (otpValue.length !== 6) {
            toast({
                title: "Error!",
                description: 'Please enter the complete 6-digit OTP',
            });
            return;
        }

        setIsLoading(true);

        try {
            const response = await api.post('/auth/confirm', { otp: otp.join('') });
            if (response.status === 200) {
                setIsVerified(true);
            } else {
                toast({
                    title: "Error!",
                    description: response.data.message,
                });
            }
        } catch (error) {
            toast({
                title: "Error!",
                description: error.response?.data?.message || "Verification failed. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }

    };

    const handleResendOtp = () => {
        setOtp(['', '', '', '', '', '']);
        toast({
            title: "OTP Sent!",
            description: "A new OTP has been sent to your email.",
        });
    };

    if (isVerified) {
        return (
            <div className="login-page">
                <div className="login-container">
                    <div className="login-card">
                        <header className="login-header">
                            <h1 className="login-title">Success!</h1>
                        </header>

                        <div className="success-message">
                            <div className="success-icon">✓</div>
                            <p className="success-text">
                                Your account has been successfully verified!
                            </p>
                            <p className="success-instruction">
                                You can now sign in to your account.
                            </p>

                            <div className="success-actions">
                                <a href="/login" className="login-btn">
                                    Continue to Sign In
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-card">
                    <header className="login-header">
                        <h1 className="login-title">Verify Email</h1>
                    </header>

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="input-group">
                            <p className="instruction-text">
                                We've sent a 6-digit verification code to<br />
                                <strong>{email}</strong>
                            </p>
                        </div>

                        <div className="otp-container">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    id={`otp-${index}`}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="otp-input"
                                    required
                                    disabled={isLoading}
                                />
                            ))}
                        </div>

                        <button
                            type="submit"
                            className={`login-btn ${isLoading ? 'loading' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="btn-loading">
                                    <span className="spinner"></span>
                                    Verifying...
                                </span>
                            ) : (
                                'Verify OTP'
                            )}
                        </button>

                        <div className="otp-actions">
                            <p className="resend-text">
                                Didn't receive the code?{' '}
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    className="resend-link"
                                >
                                    Resend OTP
                                </button>
                            </p>
                        </div>

                        <div className="back-to-login">
                            <a href="/signup" className="forgot-link">
                                ← Back to Sign Up
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SignUpPage;