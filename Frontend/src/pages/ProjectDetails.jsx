import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  MoreHorizontal, 
  MessageSquare, 
  Paperclip, 
  CheckCircle2, 
  Circle, 
  Clock, 
  CheckCircle, 
  Trash2,
  MoveRight,
  Inbox,
  Users
} from 'lucide-react';
import useProjectStore from '../store/projectStore';
import useTaskStore from '../store/taskStore';
import CreateTaskModal from '../components/CreateTaskModal';
import ManageEmployeesModal from '../components/ManageEmployeesModal';
import './ProjectDetails.css';

export default function ProjectDetails() {
  const { id } = useParams();
  const { getProjectById } = useProjectStore();
  const { 
    tasksByProject, 
    isLoading: isTasksLoading, 
    fetchTasks, 
    openModal, 
    updateTaskStatus, 
    deleteTask 
  } = useTaskStore();

  const [project, setProject] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [activeMenuTaskId, setActiveMenuTaskId] = useState(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  useEffect(() => {
    const existing = getProjectById(id);
    const projectName = existing?.name || 'Website Redesign';
    const projectDesc = existing?.description || 'Revamp the corporate website with new branding.';

    setProject({
      id,
      name: projectName,
      description: projectDesc,
    });

    fetchTasks(id);
  }, [id, getProjectById, fetchTasks]);

  // Close dropdown menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveMenuTaskId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const projectTasks = tasksByProject[id] || [];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'done': 
        return <CheckCircle2 size={18} className="text-success" />;
      case 'in_progress': 
        return <Clock size={18} className="text-warning" />;
      default: 
        return <Circle size={18} className="text-muted" />;
    }
  };

  const getTasksByStatus = (status) => {
    return projectTasks.filter(t => (t.status || 'todo') === status);
  };

  const handleTaskCreated = (newTask) => {
    setToastMessage(`Task "${newTask.title}" added successfully!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleMemberChange = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleStatusChange = (taskId, newStatus, e) => {
    e.stopPropagation();
    setActiveMenuTaskId(null);
    updateTaskStatus(id, taskId, newStatus);

    const statusLabels = { todo: 'To Do', in_progress: 'In Progress', done: 'Done' };
    setToastMessage(`Task moved to ${statusLabels[newStatus] || newStatus}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDeleteTask = (taskId, e) => {
    e.stopPropagation();
    setActiveMenuTaskId(null);
    deleteTask(id, taskId);
    setToastMessage('Task deleted');
    setTimeout(() => setToastMessage(null), 2500);
  };

  if (!project) return <div className="loading-state">Loading project...</div>;

  const todoTasks = getTasksByStatus('todo');
  const inProgressTasks = getTasksByStatus('in_progress');
  const doneTasks = getTasksByStatus('done');

  return (
    <div className="dashboard-layout animate-fade-in">
      <nav className="top-nav">
        <div className="nav-brand">
          <Link to="/" className="btn-icon" title="Back to Dashboard">
            <ArrowLeft size={20} />
          </Link>
          <h2>{project.name}</h2>
        </div>
      </nav>

      <main className="dashboard-content">
        <header className="page-header">
          <div>
            <h1>Project Board</h1>
            <p>{project.description}</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button 
              id="manage-employees-btn"
              className="btn-secondary"
              onClick={() => setIsManageModalOpen(true)}
            >
              <Users size={18} />
              <span>Manage Employees</span>
            </button>
            <button 
              id="add-task-btn"
              className="btn-primary"
              onClick={() => openModal('todo', id)}
            >
              <Plus size={20} />
              <span>Add Task</span>
            </button>
          </div>
        </header>

        {isTasksLoading ? (
          <div className="loading-state">Loading board tasks...</div>
        ) : (
          <div className="kanban-board">
            
            {/* TO DO COLUMN */}
            <div className="kanban-column">
              <div className="column-header">
                <div className="column-header-left">
                  <h3>To Do</h3>
                  <span className="task-count">{todoTasks.length}</span>
                </div>
                <button 
                  className="column-add-btn" 
                  onClick={() => openModal('todo', id)}
                  title="Add Task to To Do"
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className="task-list">
                {todoTasks.length === 0 ? (
                  <div className="empty-column">
                    <Inbox size={28} />
                    <span>No tasks to do</span>
                    <button className="empty-column-btn" onClick={() => openModal('todo', id)}>
                      <Plus size={14} /> Add Task
                    </button>
                  </div>
                ) : (
                  todoTasks.map(task => (
                    <div key={task.id} className="task-card glass-panel">
                      <div className="task-header">
                        {getStatusIcon(task.status)}
                        <div className="task-actions-menu" onClick={e => e.stopPropagation()}>
                          <button 
                            className="btn-icon-small"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuTaskId(activeMenuTaskId === task.id ? null : task.id);
                            }}
                            title="Task Actions"
                          >
                            <MoreHorizontal size={16}/>
                          </button>
                          {activeMenuTaskId === task.id && (
                            <div className="task-dropdown-menu">
                              <button className="dropdown-item" onClick={(e) => handleStatusChange(task.id, 'in_progress', e)}>
                                <MoveRight size={14} /> Start Working
                              </button>
                              <button className="dropdown-item" onClick={(e) => handleStatusChange(task.id, 'done', e)}>
                                <CheckCircle2 size={14} /> Mark as Done
                              </button>
                              <button className="dropdown-item danger" onClick={(e) => handleDeleteTask(task.id, e)}>
                                <Trash2 size={14} /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <h4 className="task-title">{task.title}</h4>
                      {task.description && <p className="task-desc-text">{task.description}</p>}

                      <div className="task-meta">
                        {task.comments > 0 && <span className="meta-item"><MessageSquare size={14}/> {task.comments}</span>}
                        {task.attachments > 0 && <span className="meta-item"><Paperclip size={14}/> {task.attachments}</span>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* IN PROGRESS COLUMN */}
            <div className="kanban-column">
              <div className="column-header">
                <div className="column-header-left">
                  <h3>In Progress</h3>
                  <span className="task-count text-warning">{inProgressTasks.length}</span>
                </div>
                <button 
                  className="column-add-btn" 
                  onClick={() => openModal('in_progress', id)}
                  title="Add Task to In Progress"
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className="task-list">
                {inProgressTasks.length === 0 ? (
                  <div className="empty-column">
                    <Inbox size={28} />
                    <span>No tasks in progress</span>
                    <button className="empty-column-btn" onClick={() => openModal('in_progress', id)}>
                      <Plus size={14} /> Add Task
                    </button>
                  </div>
                ) : (
                  inProgressTasks.map(task => (
                    <div key={task.id} className="task-card glass-panel border-warning">
                      <div className="task-header">
                        {getStatusIcon(task.status)}
                        <div className="task-actions-menu" onClick={e => e.stopPropagation()}>
                          <button 
                            className="btn-icon-small"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuTaskId(activeMenuTaskId === task.id ? null : task.id);
                            }}
                            title="Task Actions"
                          >
                            <MoreHorizontal size={16}/>
                          </button>
                          {activeMenuTaskId === task.id && (
                            <div className="task-dropdown-menu">
                              <button className="dropdown-item" onClick={(e) => handleStatusChange(task.id, 'done', e)}>
                                <CheckCircle2 size={14} /> Mark as Done
                              </button>
                              <button className="dropdown-item" onClick={(e) => handleStatusChange(task.id, 'todo', e)}>
                                <Circle size={14} /> Move to To Do
                              </button>
                              <button className="dropdown-item danger" onClick={(e) => handleDeleteTask(task.id, e)}>
                                <Trash2 size={14} /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <h4 className="task-title">{task.title}</h4>
                      {task.description && <p className="task-desc-text">{task.description}</p>}

                      <div className="task-meta">
                        {task.comments > 0 && <span className="meta-item"><MessageSquare size={14}/> {task.comments}</span>}
                        {task.attachments > 0 && <span className="meta-item"><Paperclip size={14}/> {task.attachments}</span>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* DONE COLUMN */}
            <div className="kanban-column">
              <div className="column-header">
                <div className="column-header-left">
                  <h3>Done</h3>
                  <span className="task-count text-success">{doneTasks.length}</span>
                </div>
                <button 
                  className="column-add-btn" 
                  onClick={() => openModal('done', id)}
                  title="Add Task to Done"
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className="task-list">
                {doneTasks.length === 0 ? (
                  <div className="empty-column">
                    <Inbox size={28} />
                    <span>No completed tasks</span>
                    <button className="empty-column-btn" onClick={() => openModal('done', id)}>
                      <Plus size={14} /> Add Task
                    </button>
                  </div>
                ) : (
                  doneTasks.map(task => (
                    <div key={task.id} className="task-card glass-panel border-success">
                      <div className="task-header">
                        {getStatusIcon(task.status)}
                        <div className="task-actions-menu" onClick={e => e.stopPropagation()}>
                          <button 
                            className="btn-icon-small"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuTaskId(activeMenuTaskId === task.id ? null : task.id);
                            }}
                            title="Task Actions"
                          >
                            <MoreHorizontal size={16}/>
                          </button>
                          {activeMenuTaskId === task.id && (
                            <div className="task-dropdown-menu">
                              <button className="dropdown-item" onClick={(e) => handleStatusChange(task.id, 'in_progress', e)}>
                                <Clock size={14} /> Move to In Progress
                              </button>
                              <button className="dropdown-item" onClick={(e) => handleStatusChange(task.id, 'todo', e)}>
                                <Circle size={14} /> Move to To Do
                              </button>
                              <button className="dropdown-item danger" onClick={(e) => handleDeleteTask(task.id, e)}>
                                <Trash2 size={14} /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <h4 className="task-title text-strike">{task.title}</h4>
                      {task.description && <p className="task-desc-text">{task.description}</p>}

                      <div className="task-meta">
                        {task.comments > 0 && <span className="meta-item"><MessageSquare size={14}/> {task.comments}</span>}
                        {task.attachments > 0 && <span className="meta-item"><Paperclip size={14}/> {task.attachments}</span>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}
      </main>

      <CreateTaskModal projectId={id} onCreated={handleTaskCreated} />

      <ManageEmployeesModal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        projectId={id}
        projectName={project.name}
        onMemberChange={handleMemberChange}
      />

      {toastMessage && (
        <div className="toast-notification animate-fade-in" role="status">
          <CheckCircle size={18} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
