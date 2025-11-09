import "../assets/styles/LoginPage.css";
import { useState } from "react";

function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Basic validation
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    if (password.length < 6) {
      alert('Password needs to be at least six characters long!');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const handleReset = () => {
    setPassword('');
    setConfirmPassword('');
    setIsSubmitted(false);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <header className="login-header">
            <h1 className="login-title">
              {isSubmitted ? 'Success!' : 'Reset password'}
            </h1>
          </header>
          
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="login-form">
              <div className="input-group">
                <p className="instruction-text">
                  Please insert your new password.
                </p>
              </div>
              
              <div className="input-group">
                <input 
                  name="password" 
                  type="password" 
                  placeholder="New password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-input"
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="input-group">
                <input 
                  name="confirmPassword" 
                  type="password" 
                  placeholder="Confirm password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="text-input"
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="password-requirements">
                <p className="requirements-text">
                  Password needs to be at least 6 characters long
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
                    Saving...
                  </span>
                ) : (
                  'Reset password'
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
                Password reset successfully!
              </p>
              <p className="success-instruction">
                Now you can use your new password to login.
              </p>
              
              <div className="success-actions">
                <a href="/login" className="login-btn">
                  To login
                </a>
                <button onClick={handleReset} className="back-link">
                  Reset again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;