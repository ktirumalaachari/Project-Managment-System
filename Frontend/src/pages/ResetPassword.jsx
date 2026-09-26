import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Lock, KeyRound } from 'lucide-react';
import './Login.css';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // In a real app, this token would be sent to the backend
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call to reset password
    setTimeout(() => {
      setIsLoading(false);
      // Usually you'd show a success message or automatically log them in, 
      // let's just redirect to login for simplicity.
      navigate('/login', { state: { message: 'Password reset successful. You can now login.' } });
    }, 1000);
  };

  return (
    <div className="login-container animate-fade-in">
      <div className="login-card glass-panel">
        <div className="login-header">
          <div className="logo-icon">
            <KeyRound size={32} color="var(--accent-primary)" />
          </div>
          <h2>Reset Password</h2>
          <p>Please enter your new password below</p>
        </div>

        {validationError && (
          <div className="error-message">
            {validationError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label>New Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={20} />
              <input
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="input-group">
            <label>Confirm New Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={20} />
              <input
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary login-btn" disabled={isLoading} style={{ marginTop: '1rem' }}>
            {isLoading ? 'Resetting Password...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
