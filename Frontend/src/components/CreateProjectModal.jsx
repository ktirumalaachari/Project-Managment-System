import { useState, useEffect, useRef } from 'react';
import { X, FolderPlus, Loader2, AlertCircle } from 'lucide-react';
import useProjectStore from '../store/projectStore';
import './CreateProjectModal.css';

export default function CreateProjectModal({ onCreated }) {
  const { isModalOpen, closeModal, createProject, isCreating } = useProjectStore();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Active');
  const [members, setMembers] = useState(1);
  const [validationError, setValidationError] = useState('');
  
  const nameInputRef = useRef(null);

  // Focus input when opened & handle Escape key
  useEffect(() => {
    if (isModalOpen) {
      setName('');
      setDescription('');
      setStatus('Active');
      setMembers(1);
      setValidationError('');
      
      const timer = setTimeout(() => {
        nameInputRef.current?.focus();
      }, 50);

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          closeModal();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isModalOpen, closeModal]);

  if (!isModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    
    if (!trimmedName) {
      setValidationError('Project name is required');
      nameInputRef.current?.focus();
      return;
    }

    if (trimmedName.length < 2) {
      setValidationError('Project name must be at least 2 characters');
      nameInputRef.current?.focus();
      return;
    }

    setValidationError('');

    const result = await createProject({
      name: trimmedName,
      description: description.trim(),
      status,
      members: Math.max(1, parseInt(members) || 1),
    });

    if (result.success) {
      if (onCreated) {
        onCreated(result.project);
      }
    }
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={(e) => {
        if (e.target === e.currentTarget && !isCreating) {
          closeModal();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-project-title"
    >
      <div className="modal-dialog">
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-icon-badge">
              <FolderPlus size={22} />
            </div>
            <div>
              <h2 id="create-project-title">Create New Project</h2>
              <p>Initialize a new workspace for your team tasks</p>
            </div>
          </div>
          <button 
            type="button" 
            className="modal-close-btn" 
            onClick={closeModal}
            disabled={isCreating}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="project-name">
              <span>Project Name <span className="required-star">*</span></span>
              {name.length > 0 && <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{name.length} chars</span>}
            </label>
            <input
              id="project-name"
              ref={nameInputRef}
              type="text"
              className={`input-field ${validationError ? 'input-error' : ''}`}
              placeholder="e.g., Enterprise Platform Redesign"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (validationError) setValidationError('');
              }}
              disabled={isCreating}
              maxLength={100}
            />
            {validationError && (
              <span className="error-text">
                <AlertCircle size={14} />
                {validationError}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="project-desc">Description</label>
            <textarea
              id="project-desc"
              className="input-field"
              placeholder="Provide a brief summary of the goals, scope, and timeline..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isCreating}
              maxLength={300}
            />
          </div>

          <div className="form-row-members">
            <div className="form-group">
              <label>Initial Status</label>
              <div className="status-options">
                <button
                  type="button"
                  className={`status-pill-btn ${status === 'Active' ? 'selected-active' : ''}`}
                  onClick={() => setStatus('Active')}
                  disabled={isCreating}
                >
                  <span className="status-indicator-dot" />
                  Active
                </button>
                <button
                  type="button"
                  className={`status-pill-btn ${status === 'Planning' ? 'selected-planning' : ''}`}
                  onClick={() => setStatus('Planning')}
                  disabled={isCreating}
                >
                  <span className="status-indicator-dot" />
                  Planning
                </button>
                <button
                  type="button"
                  className={`status-pill-btn ${status === 'Completed' ? 'selected-completed' : ''}`}
                  onClick={() => setStatus('Completed')}
                  disabled={isCreating}
                >
                  <span className="status-indicator-dot" />
                  Done
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="project-members">Initial Team Members</label>
              <input
                id="project-members"
                type="number"
                min="1"
                max="100"
                className="input-field"
                value={members}
                onChange={(e) => setMembers(Math.max(1, parseInt(e.target.value) || 1))}
                disabled={isCreating}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={closeModal}
              disabled={isCreating}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isCreating}
            >
              {isCreating ? (
                <>
                  <Loader2 size={18} className="spinner-icon" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <FolderPlus size={18} />
                  <span>Create Project</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
