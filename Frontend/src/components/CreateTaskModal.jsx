import { useState, useEffect, useRef } from 'react';
import { X, CheckSquare, Loader2, AlertCircle, Circle, Clock, CheckCircle2 } from 'lucide-react';
import useTaskStore from '../store/taskStore';
import './CreateProjectModal.css'; // Shared overlay styles
import './CreateTaskModal.css';

export default function CreateTaskModal({ projectId, onCreated }) {
  const { 
    isModalOpen, 
    modalInitialStatus, 
    activeProjectId, 
    closeModal, 
    addTask, 
    isCreating 
  } = useTaskStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [validationError, setValidationError] = useState('');

  const titleInputRef = useRef(null);
  const targetProjectId = projectId || activeProjectId;

  useEffect(() => {
    if (isModalOpen) {
      setTitle('');
      setDescription('');
      setStatus(modalInitialStatus || 'todo');
      setValidationError('');

      const timer = setTimeout(() => {
        titleInputRef.current?.focus();
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
  }, [isModalOpen, modalInitialStatus, closeModal]);

  if (!isModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setValidationError('Task title is required');
      titleInputRef.current?.focus();
      return;
    }

    setValidationError('');

    const result = await addTask(targetProjectId, {
      title: trimmedTitle,
      description: description.trim(),
      status,
    });

    if (result.success && onCreated) {
      onCreated(result.task);
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
      aria-labelledby="create-task-title"
    >
      <div className="task-modal-dialog">
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="task-icon-badge">
              <CheckSquare size={22} />
            </div>
            <div>
              <h2 id="create-task-title">Add New Task</h2>
              <p>Create a task and assign it to the project board</p>
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
            <label htmlFor="task-title">
              <span>Task Title <span className="required-star">*</span></span>
              {title.length > 0 && <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{title.length} chars</span>}
            </label>
            <input
              id="task-title"
              ref={titleInputRef}
              type="text"
              className={`input-field ${validationError ? 'input-error' : ''}`}
              placeholder="e.g., Design Landing Page Hero"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (validationError) setValidationError('');
              }}
              disabled={isCreating}
              maxLength={120}
            />
            {validationError && (
              <span className="error-text">
                <AlertCircle size={14} />
                {validationError}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="task-desc">Description</label>
            <textarea
              id="task-desc"
              className="input-field"
              placeholder="Add additional notes, specs, or requirements..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isCreating}
              maxLength={400}
            />
          </div>

          <div className="form-group">
            <label>Column / Status</label>
            <div className="status-pills-task">
              <button
                type="button"
                className={`task-pill ${status === 'todo' ? 'selected-todo' : ''}`}
                onClick={() => setStatus('todo')}
                disabled={isCreating}
              >
                <Circle size={14} />
                To Do
              </button>
              <button
                type="button"
                className={`task-pill ${status === 'in_progress' ? 'selected-in_progress' : ''}`}
                onClick={() => setStatus('in_progress')}
                disabled={isCreating}
              >
                <Clock size={14} />
                In Progress
              </button>
              <button
                type="button"
                className={`task-pill ${status === 'done' ? 'selected-done' : ''}`}
                onClick={() => setStatus('done')}
                disabled={isCreating}
              >
                <CheckCircle2 size={14} />
                Done
              </button>
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
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <CheckSquare size={18} />
                  <span>Create Task</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
