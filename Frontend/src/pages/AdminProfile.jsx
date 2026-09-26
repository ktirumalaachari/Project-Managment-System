import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Shield, 
  Badge, 
  Save, 
  Lock, 
  CheckCircle, 
  Camera, 
  Upload, 
  LogOut, 
  X, 
  RefreshCw, 
  Check 
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import './AdminProfile.css';

export default function AdminProfile() {
  const { user, updateProfile, logout } = useAuthStore();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    employeeId: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Camera & File Upload states
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [cameraError, setCameraError] = useState(null);

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Sync state with store user on mount & user update
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        employeeId: user.employeeId || ''
      });
    }
  }, [user]);

  // Clean up camera stream when modal is closed
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  const stopCameraStream = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    await updateProfile({
      name: formData.name,
      email: formData.email,
      employeeId: formData.employeeId
    });
    setIsEditing(false);
    showToast('Profile details updated successfully!');
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    showToast('Password updated successfully!');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // --- 1. FROM DEVICE (File Upload) ---
  const handleDeviceUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      const reader = new FileReader();
      reader.onload = async (event) => {
        const imageDataUrl = event.target?.result;
        if (imageDataUrl) {
          await updateProfile({ avatar: imageDataUrl });
          showToast('Profile photo updated from device!');
        }
      };
      reader.readAsDataURL(file);
    }
    // reset input value so re-selecting same file triggers change
    e.target.value = '';
  };

  // --- 2. TAKE PICTURE (Camera Capture) ---
  const handleOpenCameraModal = async () => {
    setCapturedPhoto(null);
    setCameraError(null);
    setIsCameraModalOpen(true);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your browser');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, facingMode: 'user' },
        audio: false
      });

      setCameraStream(stream);

      // Attach stream to video element once modal mounts
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);

    } catch (err) {
      console.error('Camera access error:', err);
      setCameraError(err.message || 'Unable to access device camera. Please check permissions.');
    }
  };

  const handleCloseCameraModal = () => {
    stopCameraStream();
    setIsCameraModalOpen(false);
    setCapturedPhoto(null);
    setCameraError(null);
  };

  const handleSnapPhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedPhoto(dataUrl);
      }
    }
  };

  const handleUseCapturedPhoto = async () => {
    if (capturedPhoto) {
      await updateProfile({ avatar: capturedPhoto });
      handleCloseCameraModal();
      showToast('New photo captured & updated!');
    }
  };

  return (
    <div className="dashboard-layout animate-fade-in">
      <nav className="top-nav">
        <div className="nav-brand">
          <Link to="/" className="btn-icon" title="Back to Dashboard">
            <ArrowLeft size={20} />
          </Link>
          <h2>Admin Profile</h2>
        </div>
      </nav>

      <main className="profile-content">
        <div className="profile-grid">
          
          {/* Profile Overview Card */}
          <div className="profile-card glass-panel text-center">
            
            {/* Avatar Preview */}
            <div className="profile-avatar-large">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="avatar-img-large" />
              ) : (
                user?.name?.charAt(0) || 'A'
              )}
            </div>

            {/* Image Options: From Device & Take Picture */}
            <div className="photo-options-container">
              <span className="photo-options-label">Profile Image</span>
              <div className="photo-buttons-group">
                <button 
                  type="button" 
                  className="btn-photo-option"
                  onClick={handleDeviceUploadClick}
                  title="Upload photo from device"
                >
                  <Upload size={14} />
                  <span>From Device</span>
                </button>

                <button 
                  type="button" 
                  className="btn-photo-option"
                  onClick={handleOpenCameraModal}
                  title="Capture photo using camera"
                >
                  <Camera size={14} />
                  <span>Take Picture</span>
                </button>
              </div>

              {/* Hidden File Input */}
              <input 
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>

            <h2>{user?.name || 'Admin User'}</h2>
            
            <div className="role-badge">
              <Shield size={14} />
              <span>{(user?.role || 'ADMIN').toUpperCase()}</span>
            </div>

            {/* Disclaimer */}
            <p className="profile-desc">
              System Administrator with full access to project and user management.
            </p>

            {/* Logout Button below Disclaimer */}
            <button 
              type="button" 
              className="btn-logout-card"
              onClick={handleLogout}
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>

          {/* Profile Details Form */}
          <div className="profile-details glass-panel">
            <div className="section-header">
              <h3>Personal Information</h3>
              <button 
                type="button"
                className={`btn-secondary ${isEditing ? 'active' : ''}`}
                onClick={() => {
                  if (isEditing && user) {
                    setFormData({
                      name: user.name || '',
                      email: user.email || '',
                      employeeId: user.employeeId || ''
                    });
                  }
                  setIsEditing(!isEditing);
                }}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            <form onSubmit={handleProfileSubmit} className="profile-form">
              <div className="form-row">
                <div className="input-group">
                  <label>Full Name</label>
                  <div className="input-wrapper">
                    <User className="input-icon" size={18} />
                    <input 
                      type="text" 
                      className="input-field" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      disabled={!isEditing}
                      required
                    />
                  </div>
                </div>
                
                <div className="input-group">
                  <label>Employee ID</label>
                  <div className="input-wrapper">
                    <Badge className="input-icon" size={18} />
                    <input 
                      type="text" 
                      className="input-field" 
                      value={formData.employeeId}
                      onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                      disabled={!isEditing}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="input-group">
                <label>Email Address</label>
                <div className="input-wrapper">
                  <Mail className="input-icon" size={18} />
                  <input 
                    type="email" 
                    className="input-field" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    disabled={!isEditing}
                    required
                  />
                </div>
              </div>

              {isEditing && (
                <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>
                  <Save size={18} />
                  <span>Save Changes</span>
                </button>
              )}
            </form>

            <hr className="divider" />

            {/* Password Management */}
            <div className="section-header">
              <h3>Change Password</h3>
            </div>
            
            <form onSubmit={handlePasswordSubmit} className="profile-form">
              <div className="input-group">
                <label>Current Password</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={18} />
                  <input 
                    type="password" 
                    className="input-field" 
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="input-group">
                  <label>New Password</label>
                  <div className="input-wrapper">
                    <Lock className="input-icon" size={18} />
                    <input 
                      type="password" 
                      className="input-field" 
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className="input-group">
                  <label>Confirm New Password</label>
                  <div className="input-wrapper">
                    <Lock className="input-icon" size={18} />
                    <input 
                      type="password" 
                      className="input-field" 
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      required
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn-secondary" style={{ marginTop: '1rem' }}>
                Update Password
              </button>
            </form>
          </div>

        </div>
      </main>

      {/* --- CAMERA CAPTURE MODAL --- */}
      {isCameraModalOpen && (
        <div className="camera-modal-overlay" role="dialog" aria-modal="true">
          <div className="camera-dialog">
            <div className="modal-header">
              <div className="modal-title-group">
                <div className="modal-icon-badge">
                  <Camera size={22} />
                </div>
                <div>
                  <h2>Take Picture</h2>
                  <p>Capture a photo using your device camera</p>
                </div>
              </div>
              <button 
                type="button" 
                className="modal-close-btn" 
                onClick={handleCloseCameraModal}
              >
                <X size={20} />
              </button>
            </div>

            <div className="camera-view-container">
              {cameraError ? (
                <div className="camera-error-message">
                  <Camera size={40} style={{ opacity: 0.5 }} />
                  <p>{cameraError}</p>
                </div>
              ) : capturedPhoto ? (
                <img src={capturedPhoto} alt="Captured preview" className="camera-canvas" />
              ) : (
                <video ref={videoRef} autoPlay playsInline className="camera-video" />
              )}
              {/* Hidden canvas for taking snapshot */}
              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>

            <div className="camera-actions-footer">
              <button 
                type="button" 
                className="btn-secondary"
                onClick={handleCloseCameraModal}
              >
                Cancel
              </button>

              {!cameraError && (
                capturedPhoto ? (
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button 
                      type="button" 
                      className="btn-secondary"
                      onClick={() => setCapturedPhoto(null)}
                    >
                      <RefreshCw size={16} />
                      <span>Retake</span>
                    </button>
                    <button 
                      type="button" 
                      className="btn-primary"
                      onClick={handleUseCapturedPhoto}
                    >
                      <Check size={16} />
                      <span>Use Photo</span>
                    </button>
                  </div>
                ) : (
                  <button 
                    type="button" 
                    className="btn-primary"
                    onClick={handleSnapPhoto}
                  >
                    <Camera size={18} />
                    <span>Snap Photo</span>
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="toast-notification animate-fade-in" role="status">
          <CheckCircle size={18} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
