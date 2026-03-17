import { AdminApi } from "@/api/api";
import "../assets/styles/LoginPage.css";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const api = AdminApi.getInstance();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post('/admin/login', { email });
      if (response.status === 200) {
        toast({ title: "OTP Sent!", description: "Check your email for the verification code." });
        navigate('/verify-otp', { state: { email } });
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({
        title: "Access Denied",
        description: err.response?.data?.message || "Login failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
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
            <h1 className="login-title">Welcome back</h1>
          </header>

          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="Admin Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-input"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              className={`login-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="btn-loading">
                  <span className="spinner"></span>
                  Sending OTP...
                </span>
              ) : (
                'Send OTP'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
