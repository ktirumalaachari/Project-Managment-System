import { create } from 'zustand';
import api from '../utils/api';

const DEFAULT_MEMBERS = [
  { id: 'm1', name: 'Smrutirupa Sahu', email: 'smrutirupa@projectcamp.com', employeeId: 'EMP-331', role: 'Admin' },
  { id: 'm2', name: 'Alex Johnson', email: 'alex@projectcamp.com', employeeId: 'EMP-102', role: 'Member' },
  { id: 'm3', name: 'Maria Garcia', email: 'maria@projectcamp.com', employeeId: 'EMP-105', role: 'Member' },
  { id: 'm4', name: 'David Kim', email: 'david@projectcamp.com', employeeId: 'EMP-110', role: 'Member' },
];

const DEFAULT_PROJECTS = [
  { id: '1', name: 'Website Redesign', description: 'Revamp the corporate website with new branding.', members: 4, memberList: DEFAULT_MEMBERS, status: 'Active' },
  { id: '2', name: 'Mobile App V2', description: 'New features for the iOS and Android apps.', members: 3, memberList: DEFAULT_MEMBERS.slice(0, 3), status: 'Planning' },
  { id: '3', name: 'Marketing Campaign Q4', description: 'End of year promotional campaign assets.', members: 2, memberList: DEFAULT_MEMBERS.slice(0, 2), status: 'Active' },
  { id: '4', name: 'Database Migration', description: 'Migrate legacy SQL database to the new NoSQL infrastructure.', members: 4, memberList: DEFAULT_MEMBERS, status: 'Planning' },
  { id: '5', name: 'Security Audit Q3', description: 'Comprehensive security review of all external-facing APIs.', members: 2, memberList: DEFAULT_MEMBERS.slice(0, 2), status: 'Active' },
  { id: '6', name: 'Employee Onboarding Portal', description: 'Internal tool to streamline the onboarding process for new hires.', members: 3, memberList: DEFAULT_MEMBERS.slice(0, 3), status: 'Active' },
];

const loadInitialProjects = () => {
  try {
    const saved = localStorage.getItem('pc_projects');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(p => ({
          ...p,
          memberList: Array.isArray(p.memberList) && p.memberList.length > 0 ? p.memberList : DEFAULT_MEMBERS.slice(0, Math.min(p.members || 1, 4)),
          members: Array.isArray(p.memberList) && p.memberList.length > 0 ? p.memberList.length : (p.members || 1)
        }));
      }
    }
  } catch (err) {
    console.error('Error loading projects from localStorage:', err);
  }
  return DEFAULT_PROJECTS;
};

const saveProjectsToStorage = (projects) => {
  try {
    localStorage.setItem('pc_projects', JSON.stringify(projects));
  } catch (err) {
    console.error('Error saving projects to localStorage:', err);
  }
};

export const useProjectStore = create((set, get) => ({
  projects: loadInitialProjects(),
  isLoading: false,
  isCreating: false,
  error: null,
  isModalOpen: false,

  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),

  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/projects');
      if (response?.data?.data && Array.isArray(response.data.data)) {
        const backendProjects = response.data.data.map(item => {
          const proj = item.project || item;
          return {
            id: proj._id || proj.id,
            name: proj.name,
            description: proj.description || '',
            members: proj.members || item.members || 1,
            memberList: proj.memberList || DEFAULT_MEMBERS.slice(0, proj.members || 1),
            status: proj.status || 'Active',
            createdAt: proj.createdAt,
          };
        });
        
        if (backendProjects.length > 0) {
          set({ projects: backendProjects, isLoading: false });
          saveProjectsToStorage(backendProjects);
          return;
        }
      }
    } catch (err) {
      console.info('Backend not reachable, using local projects cache:', err.message);
    }

    const current = get().projects.length > 0 ? get().projects : loadInitialProjects();
    set({ projects: current, isLoading: false });
  },

  createProject: async ({ name, description = '', status = 'Active', members = 1 }) => {
    set({ isCreating: true, error: null });
    
    let createdId = Date.now().toString();

    try {
      const response = await api.post('/projects', { 
        name: name.trim(), 
        description: description.trim() 
      });
      if (response?.data?.data?._id) {
        createdId = response.data.data._id;
      }
    } catch (err) {
      console.info('Backend project creation skipped, persisting locally:', err.message);
    }

    const initialCount = Math.max(1, parseInt(members) || 1);
    const initialMemberList = DEFAULT_MEMBERS.slice(0, Math.min(initialCount, DEFAULT_MEMBERS.length));

    const newProject = {
      id: createdId,
      name: name.trim(),
      description: description.trim(),
      status: status || 'Active',
      members: initialMemberList.length,
      memberList: initialMemberList,
      createdAt: new Date().toISOString(),
    };

    const currentProjects = get().projects;
    const updated = [newProject, ...currentProjects];

    saveProjectsToStorage(updated);
    set({ 
      projects: updated, 
      isCreating: false,
      isModalOpen: false 
    });

    return { success: true, project: newProject };
  },

  addMemberToProject: async (projectId, { name, email, employeeId, role = 'Member' }) => {
    const currentProjects = get().projects;
    const project = currentProjects.find(p => String(p.id || p._id) === String(projectId));
    if (!project) return { success: false, message: 'Project not found' };

    const newMember = {
      id: `m-${Date.now()}`,
      name: name.trim(),
      email: email ? email.trim() : `${name.toLowerCase().replace(/\s+/g, '')}@projectcamp.com`,
      employeeId: employeeId ? employeeId.trim() : `EMP-${Math.floor(100 + Math.random() * 900)}`,
      role: role || 'Member'
    };

    const updatedMemberList = [...(project.memberList || []), newMember];

    const updatedProjects = currentProjects.map(p => {
      if (String(p.id || p._id) === String(projectId)) {
        return {
          ...p,
          memberList: updatedMemberList,
          members: updatedMemberList.length
        };
      }
      return p;
    });

    saveProjectsToStorage(updatedProjects);
    set({ projects: updatedProjects });

    try {
      await api.post(`/projects/${projectId}/members`, { userId: newMember.id, role: newMember.role });
    } catch (err) {
      console.info('Backend member add skipped:', err.message);
    }

    return { success: true, member: newMember };
  },

  removeMemberFromProject: async (projectId, memberId) => {
    const currentProjects = get().projects;
    const project = currentProjects.find(p => String(p.id || p._id) === String(projectId));
    if (!project) return { success: false, message: 'Project not found' };

    const updatedMemberList = (project.memberList || []).filter(m => String(m.id) !== String(memberId));

    const updatedProjects = currentProjects.map(p => {
      if (String(p.id || p._id) === String(projectId)) {
        return {
          ...p,
          memberList: updatedMemberList,
          members: updatedMemberList.length
        };
      }
      return p;
    });

    saveProjectsToStorage(updatedProjects);
    set({ projects: updatedProjects });

    try {
      await api.delete(`/projects/${projectId}/members/${memberId}`);
    } catch (err) {
      console.info('Backend member delete skipped:', err.message);
    }

    return { success: true };
  },

  getProjectById: (id) => {
    const { projects } = get();
    return projects.find(p => String(p.id || p._id) === String(id));
  },

  deleteProject: (id) => {
    const updated = get().projects.filter(p => String(p.id || p._id) !== String(id));
    saveProjectsToStorage(updated);
    set({ projects: updated });
  }
}));

export default useProjectStore;
