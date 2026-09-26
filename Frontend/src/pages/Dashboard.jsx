import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Folder, Users, MoreVertical, LogOut, CheckCircle, FolderOpen } from 'lucide-react';
import useAuthStore from '../store/authStore';
import useProjectStore from '../store/projectStore';
import CreateProjectModal from '../components/CreateProjectModal';
import './Dashboard.css';

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const { projects, isLoading, fetchProjects, openModal } = useProjectStore();
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleProjectCreated = (newProj) => {
    setToastMessage(`Project "${newProj.name}" created successfully!`);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  return (
    <div className="dashboard-layout animate-fade-in">
      <nav className="top-nav">
        <div className="nav-brand">
          <div className="brand-logo">PC</div>
          <h2>Project Camp</h2>
        </div>
        
        <div className="nav-actions">
          <Link to="/profile" className="user-profile" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="avatar">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                user?.name?.charAt(0) || 'U'
              )}
            </div>
            <div className="user-info">
              <span className="user-name">{user?.name || 'User'}</span>
              <span className="user-role">{user?.role || 'Member'}</span>
            </div>
          </Link>
          <button className="btn-icon" onClick={logout} title="Logout">
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      <main className="dashboard-content">
        <header className="page-header">
          <div>
            <h1>Projects</h1>
            <p>Manage and track all your active projects.</p>
          </div>
          
          {(!user || user?.role === 'admin' || user?.role === 'member') && (
            <button 
              id="new-project-btn"
              className="btn-primary" 
              onClick={openModal}
            >
              <Plus size={20} />
              <span>New Project</span>
            </button>
          )}
        </header>

        {isLoading ? (
          <div className="loading-state">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="empty-state glass-panel">
            <div className="empty-state-icon">
              <FolderOpen size={32} />
            </div>
            <h3>No projects found</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '400px' }}>
              You don&apos;t have any active projects yet. Click below to create your first project.
            </p>
            <button className="btn-primary" onClick={openModal}>
              <Plus size={18} />
              <span>Create First Project</span>
            </button>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map(project => (
              <Link to={`/projects/${project.id || project._id}`} key={project.id || project._id} className="project-card glass-panel">
                <div className="card-header">
                  <div className="project-icon">
                    <Folder size={24} color="var(--accent-primary)" />
                  </div>
                  <button 
                    className="btn-icon" 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    title="Project options"
                  >
                    <MoreVertical size={20} />
                  </button>
                </div>
                
                <h3 className="project-title">{project.name}</h3>
                <p className="project-desc">{project.description || 'No description provided.'}</p>
                
                <div className="card-footer">
                  <div className="project-members">
                    <Users size={16} />
                    <span>{project.members || 1} members</span>
                  </div>
                  <span className={`status-badge status-${(project.status || 'Active').toLowerCase()}`}>
                    {project.status || 'Active'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <CreateProjectModal onCreated={handleProjectCreated} />

      {toastMessage && (
        <div className="toast-notification animate-fade-in" role="status">
          <CheckCircle size={18} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
