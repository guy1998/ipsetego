import { AdminApi } from "@/api/api";
import "../assets/styles/LoginPage.css";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";

function OtpPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const api = AdminApi.getInstance();

  const email = (location.state as { email?: string })?.email || '';

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value !== '' && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!digits) return;
    const newOtp = [...otp];
    digits.split('').forEach((char, i) => { newOtp[i] = char; });
    setOtp(newOtp);
    const nextIndex = Math.min(digits.length, 5);
    const nextInput = document.getElementById(`otp-${nextIndex}`);
    if (nextInput) nextInput.focus();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      toast({ title: "Error!", description: 'Please enter the complete 6-digit OTP' });
      return;
    }
    setIsLoading(true);
    try {
      const response = await api.post('/admin/verify-otp', { otp: otpValue });
      if (response.status === 200) {
        toast({ title: "Success!", description: "Logged in successfully!" });
        setTimeout(() => navigate('/admin/users'), 500);
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({
        title: "Error!",
        description: err.response?.data?.message || "Verification failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) return;
    try {
      await api.post('/admin/login', { email });
      setOtp(['', '', '', '', '', '']);
      toast({ title: "OTP Sent!", description: "A new OTP has been sent to your email." });
    } catch {
      toast({ title: "Error!", description: "Failed to resend OTP." });
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg-blob" />
      <div className="login-bg-blob" />
      <div className="login-bg-blob" />
      <div className="login-bg-blob" />
      <div className="login-bg-blob" />

      <div className="login-container">
        <div className="login-card">
          <div className="login-logo">
            <div className="login-logo-icon">
              <span>ip</span>
            </div>
            <span className="login-logo-name">ipsetego</span>
          </div>
          <p className="login-subtitle">Admin Panel</p>

          <header className="login-header">
            <h1 className="login-title">Verify OTP</h1>
          </header>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <p className="instruction-text">
                We've sent a 6-digit verification code to<br />
                <strong>{email || 'your email'}</strong>
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
                  onPaste={handlePaste}
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
                <button type="button" onClick={handleResendOtp} className="resend-link">
                  Resend OTP
                </button>
              </p>
            </div>

            <div className="back-to-login">
              <a href="/login" className="forgot-link">← Back to Login</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default OtpPage;
