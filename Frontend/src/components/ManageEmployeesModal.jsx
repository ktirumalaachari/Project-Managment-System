import { useState, useEffect, useRef } from 'react';
import { X, Users, UserPlus, UserMinus, Shield, AlertCircle, Loader2, Mail, Badge, User } from 'lucide-react';
import useProjectStore from '../store/projectStore';
import './CreateProjectModal.css'; // Shared overlay animation
import './ManageEmployeesModal.css';

export default function ManageEmployeesModal({ isOpen, onClose, projectId, projectName, onMemberChange }) {
  const { getProjectById, addMemberToProject, removeMemberFromProject } = useProjectStore();

  const [name, setName] = useState('');
  const [emailOrId, setEmailOrId] = useState('');
  const [role, setRole] = useState('Member');
  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nameInputRef = useRef(null);
  const project = getProjectById(projectId);
  const memberList = project?.memberList || [];

  useEffect(() => {
    if (isOpen) {
      setName('');
      setEmailOrId('');
      setRole('Member');
      setValidationError('');

      const timer = setTimeout(() => {
        nameInputRef.current?.focus();
      }, 50);

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      setValidationError('Employee name is required');
      nameInputRef.current?.focus();
      return;
    }

    setValidationError('');
    setIsSubmitting(true);

    const inputVal = emailOrId.trim();
    const isEmail = inputVal.includes('@');
    const email = isEmail ? inputVal : `${trimmedName.toLowerCase().replace(/\s+/g, '')}@projectcamp.com`;
    const employeeId = isEmail ? `EMP-${Math.floor(100 + Math.random() * 900)}` : (inputVal || `EMP-${Math.floor(100 + Math.random() * 900)}`);

    const result = await addMemberToProject(projectId, {
      name: trimmedName,
      email,
      employeeId,
      role
    });

    setIsSubmitting(false);

    if (result.success) {
      setName('');
      setEmailOrId('');
      setRole('Member');
      if (onMemberChange) {
        onMemberChange(`Added "${trimmedName}" to project`);
      }
    }
  };

  const handleRemoveMember = async (memberId, memberName) => {
    if (memberList.length <= 1) {
      alert('Cannot remove the last member of the project.');
      return;
    }

    const result = await removeMemberFromProject(projectId, memberId);
    if (result.success && onMemberChange) {
      onMemberChange(`Removed "${memberName}" from project`);
    }
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="manage-employees-title"
    >
      <div className="manage-modal-dialog">
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-icon-badge">
              <Users size={22} />
            </div>
            <div>
              <h2 id="manage-employees-title">Manage Project Employees</h2>
              <p>Add or remove team members for &quot;{projectName || project?.name}&quot;</p>
            </div>
          </div>
          <button 
            type="button" 
            className="modal-close-btn" 
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        <div className="manage-modal-body">
          {/* Add Employee Form Card */}
          <div className="add-employee-card">
            <h4>
              <UserPlus size={16} color="var(--accent-primary)" />
              <span>Add New Employee to Project</span>
            </h4>

            <form onSubmit={handleAddEmployee} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div className="employee-form-grid">
                <div className="form-group">
                  <label htmlFor="emp-name">Employee Full Name *</label>
                  <input
                    id="emp-name"
                    ref={nameInputRef}
                    type="text"
                    className={`input-field ${validationError ? 'input-error' : ''}`}
                    placeholder="e.g., Alex Johnson"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (validationError) setValidationError('');
                    }}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="emp-id-email">Email or Employee ID</label>
                  <input
                    id="emp-id-email"
                    type="text"
                    className="input-field"
                    placeholder="e.g., EMP-105 or alex@co.com"
                    value={emailOrId}
                    onChange={(e) => setEmailOrId(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="employee-form-grid" style={{ alignItems: 'flex-end' }}>
                <div className="form-group">
                  <label htmlFor="emp-role">Project Role</label>
                  <select
                    id="emp-role"
                    className="role-select"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    disabled={isSubmitting}
                  >
                    <option value="Member">Member</option>
                    <option value="Admin">Project Admin</option>
                  </select>
                </div>

                <button 
                  type="submit" 
                  className="btn-primary" 
                  disabled={isSubmitting}
                  style={{ height: '44px' }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="spinner-icon" />
                      <span>Adding...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus size={16} />
                      <span>Add to Project</span>
                    </>
                  )}
                </button>
              </div>

              {validationError && (
                <span className="error-text">
                  <AlertCircle size={14} />
                  {validationError}
                </span>
              )}
            </form>
          </div>

          {/* Current Assigned Members List */}
          <div>
            <div className="members-section-title">
              <span>Current Project Team</span>
              <span className="task-count">{memberList.length} members</span>
            </div>

            <div className="members-list">
              {memberList.map((member) => (
                <div key={member.id} className="member-item">
                  <div className="member-info-group">
                    <div className="member-avatar">
                      {member.name?.charAt(0) || 'E'}
                    </div>
                    <div className="member-details">
                      <span className="member-name">{member.name}</span>
                      <span className="member-subtext">{member.email || member.employeeId}</span>
                    </div>
                  </div>

                  <div className="member-actions">
                    <span className={`role-pill ${member.role?.toLowerCase() === 'admin' ? 'admin' : 'member'}`}>
                      {member.role || 'Member'}
                    </span>
                    <button
                      type="button"
                      className="btn-remove-member"
                      onClick={() => handleRemoveMember(member.id, member.name)}
                      title={`Remove ${member.name} from project`}
                    >
                      <UserMinus size={14} />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
