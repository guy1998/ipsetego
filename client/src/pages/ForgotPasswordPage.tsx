import "../assets/styles/LoginPage.css";
import { useState } from "react";

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const handleReset = () => {
    setEmail('');
    setIsSubmitted(false);
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
          <header className="login-header">
            <h1 className="login-title">
              {isSubmitted ? 'Check your email!' : 'Reset password'}
            </h1>
          </header>
          
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="login-form">
              <div className="input-group">
                <p className="instruction-text">
                  Give use your email address to reset your password
                </p>
              </div>
              
              <div className="input-group">
                <input 
                  type="email" 
                  name="email" 
                  placeholder="Email" 
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
                    Sending...
                  </span>
                ) : (
                  'Send link'
                )}
              </button>

              <div className="back-to-login">
                <a href="/login" className="forgot-link">
                  ← Back to login
                </a>
              </div>
            </form>
          ) : (
            <div className="success-message">
              <div className="success-icon">✓</div>
              <p className="success-text">
                We sent a link to change the password at this email address: <strong>{email}</strong>.
              </p>
              <p className="success-instruction">
                Please check your email and follow the instructions.
              </p>
              
              <div className="success-actions">
                <button onClick={handleReset} className="login-btn secondary">
                  Send again
                </button>
                <a href="/login" className="back-link">
                  Back to login
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;