import { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, Mail } from 'lucide-react';
import './Login.css'; // Reusing the login styles

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call to send reset email
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1000);
  };

  if (isSuccess) {
    return (
      <div className="login-container animate-fade-in">
        <div className="login-card glass-panel" style={{ textAlign: 'center' }}>
          <div className="logo-icon" style={{ backgroundColor: 'var(--success-bg)', borderColor: 'var(--success)' }}>
            <Mail size={32} color="var(--success)" />
          </div>
          <h2>Check Your Email</h2>
          <p style={{ margin: '1rem 0' }}>
            We have sent a password reset link to <strong>{email}</strong>.
            Please check your inbox and follow the instructions.
          </p>
          <Link to="/login" className="btn-primary login-btn" style={{ marginTop: '1rem' }}>
            Return to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container animate-fade-in">
      <div className="login-card glass-panel">
        <div className="login-header">
          <div className="logo-icon">
            <KeyRound size={32} color="var(--accent-primary)" />
          </div>
          <h2>Forgot Password?</h2>
          <p>Enter your email address to get a reset link</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={20} />
              <input
                type="email"
                className="input-field"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary login-btn" disabled={isLoading} style={{ marginTop: '1rem' }}>
            {isLoading ? 'Sending Link...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="login-footer">
          <p>Remembered your password? <Link to="/login">Sign in here</Link></p>
        </div>
      </div>
    </div>
  );
}
