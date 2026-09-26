import { create } from 'zustand';
import api from '../utils/api';

const DEFAULT_PROJECT_TASKS = {
  '1': [
    { id: '101', title: 'Design System', description: 'Create unified color palettes, typography, and component specs.', status: 'done', comments: 3, attachments: 1 },
    { id: '102', title: 'Homepage Wireframes', description: 'High fidelity interactive wireframes for desktop & mobile.', status: 'in_progress', comments: 8, attachments: 2 },
    { id: '103', title: 'Copywriting for About page', description: 'Draft compelling marketing text and team bios.', status: 'todo', comments: 0, attachments: 0 },
    { id: '104', title: 'Hero Section Assets', description: '3D renders and hero illustrations.', status: 'in_progress', comments: 1, attachments: 4 },
    { id: '105', title: 'Footer Design', description: 'Legal links, newsletter signup, and sitemap layout.', status: 'todo', comments: 0, attachments: 0 },
  ]
};

const loadStoredTasks = (projectId) => {
  try {
    const saved = localStorage.getItem(`pc_tasks_${projectId}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('Error loading stored tasks:', err);
  }
  return DEFAULT_PROJECT_TASKS[projectId] || [
    { id: `${Date.now()}-1`, title: 'Initial Project Planning', description: 'Set up project milestones and team roles.', status: 'done', comments: 2, attachments: 1 },
    { id: `${Date.now()}-2`, title: 'Architecture Review', description: 'Define core database schema and API contracts.', status: 'in_progress', comments: 1, attachments: 0 },
    { id: `${Date.now()}-3`, title: 'Setup Development Environment', description: 'Configure linting, CI/CD pipelines, and local dev scripts.', status: 'todo', comments: 0, attachments: 0 },
  ];
};

const saveStoredTasks = (projectId, tasks) => {
  try {
    localStorage.setItem(`pc_tasks_${projectId}`, JSON.stringify(tasks));
  } catch (err) {
    console.error('Error saving tasks to localStorage:', err);
  }
};

export const useTaskStore = create((set, get) => ({
  tasksByProject: {},
  isLoading: false,
  isCreating: false,
  error: null,
  isModalOpen: false,
  modalInitialStatus: 'todo',
  activeProjectId: null,

  openModal: (status = 'todo', projectId = null) => {
    set({ 
      isModalOpen: true, 
      modalInitialStatus: status || 'todo',
      activeProjectId: projectId || get().activeProjectId 
    });
  },

  closeModal: () => set({ isModalOpen: false }),

  fetchTasks: async (projectId) => {
    set({ isLoading: true, activeProjectId: projectId, error: null });
    let tasks = loadStoredTasks(projectId);

    try {
      const response = await api.get(`/tasks/${projectId}`);
      if (response?.data?.data && Array.isArray(response.data.data)) {
        const backendTasks = response.data.data.map(t => ({
          id: t._id || t.id,
          title: t.title,
          description: t.description || '',
          status: (t.status || 'todo').toLowerCase(),
          comments: t.commentsCount || 0,
          attachments: t.attachments?.length || 0,
        }));
        if (backendTasks.length > 0) {
          tasks = backendTasks;
        }
      }
    } catch (err) {
      console.info('Backend task fetch skipped, using local task cache:', err.message);
    }

    set(state => ({
      tasksByProject: {
        ...state.tasksByProject,
        [projectId]: tasks
      },
      isLoading: false
    }));

    saveStoredTasks(projectId, tasks);
  },

  addTask: async (projectId, { title, description = '', status = 'todo' }) => {
    set({ isCreating: true, error: null });
    
    let createdId = Date.now().toString();
    const formattedStatus = status || 'todo';

    try {
      const response = await api.post(`/tasks/${projectId}`, {
        title: title.trim(),
        description: description.trim(),
        status: formattedStatus
      });
      if (response?.data?.data?._id) {
        createdId = response.data.data._id;
      }
    } catch (err) {
      console.info('Backend task creation skipped, persisting locally:', err.message);
    }

    const newTask = {
      id: createdId,
      title: title.trim(),
      description: description.trim(),
      status: formattedStatus,
      comments: 0,
      attachments: 0,
      createdAt: new Date().toISOString(),
    };

    const currentTasks = get().tasksByProject[projectId] || loadStoredTasks(projectId);
    const updatedTasks = [newTask, ...currentTasks];

    saveStoredTasks(projectId, updatedTasks);

    set(state => ({
      tasksByProject: {
        ...state.tasksByProject,
        [projectId]: updatedTasks
      },
      isCreating: false,
      isModalOpen: false
    }));

    return { success: true, task: newTask };
  },

  updateTaskStatus: async (projectId, taskId, newStatus) => {
    const currentTasks = get().tasksByProject[projectId] || [];
    const updatedTasks = currentTasks.map(t => 
      String(t.id) === String(taskId) ? { ...t, status: newStatus } : t
    );

    saveStoredTasks(projectId, updatedTasks);

    set(state => ({
      tasksByProject: {
        ...state.tasksByProject,
        [projectId]: updatedTasks
      }
    }));

    try {
      await api.put(`/tasks/${projectId}/t/${taskId}`, { status: newStatus });
    } catch (err) {
      console.info('Backend status update skipped:', err.message);
    }
  },

  deleteTask: async (projectId, taskId) => {
    const currentTasks = get().tasksByProject[projectId] || [];
    const updatedTasks = currentTasks.filter(t => String(t.id) !== String(taskId));

    saveStoredTasks(projectId, updatedTasks);

    set(state => ({
      tasksByProject: {
        ...state.tasksByProject,
        [projectId]: updatedTasks
      }
    }));

    try {
      await api.delete(`/tasks/${projectId}/t/${taskId}`);
    } catch (err) {
      console.info('Backend task deletion skipped:', err.message);
    }
  }
}));

export default useTaskStore;
