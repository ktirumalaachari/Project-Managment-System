import { create } from 'zustand';
import api from '../utils/api';

const DEFAULT_USER = {
  id: 1,
  name: 'Admin User',
  employeeId: 'EMP001',
  email: 'admin@projectcamp.com',
  role: 'admin'
};

const getStoredUser = () => {
  try {
    const saved = localStorage.getItem('pc_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') {
        return {
          id: parsed.id || 1,
          name: parsed.name || DEFAULT_USER.name,
          employeeId: parsed.employeeId || DEFAULT_USER.employeeId,
          email: parsed.email || DEFAULT_USER.email,
          role: parsed.role || DEFAULT_USER.role,
        };
      }
    }
  } catch (err) {
    console.error('Error loading stored user:', err);
  }
  return DEFAULT_USER;
};

const saveUserToStorage = (user) => {
  try {
    localStorage.setItem('pc_user', JSON.stringify(user));
  } catch (err) {
    console.error('Error saving user to localStorage:', err);
  }
};

const useAuthStore = create((set, get) => ({
  user: getStoredUser(),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,

  login: async (inputEmployeeId, password) => {
    set({ isLoading: true, error: null });
    try {
      // Mock login response
      setTimeout(() => {
        const rawInput = inputEmployeeId ? inputEmployeeId.trim() : '';
        const isEmail = rawInput.includes('@');

        const existingStored = getStoredUser();
        
        let finalEmpId = isEmail ? (existingStored.employeeId || 'EMP001') : rawInput;
        let finalEmail = isEmail ? rawInput : (existingStored.email || 'admin@projectcamp.com');
        let finalName = existingStored.name || 'Admin User';

        const user = {
          id: existingStored.id || 1,
          name: finalName,
          employeeId: finalEmpId,
          email: finalEmail,
          role: 'admin'
        };

        const accessToken = 'mock-jwt-token';
        localStorage.setItem('token', accessToken);
        saveUserToStorage(user);

        set({ user, isAuthenticated: true, isLoading: false });
      }, 500);

    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Login failed', 
        isLoading: false 
      });
    }
  },

  register: async (name, employeeId, email, password) => {
    set({ isLoading: true, error: null });
    try {
      setTimeout(() => {
        const user = { 
          id: Date.now(), 
          name: name.trim(), 
          employeeId: employeeId ? employeeId.trim() : 'EMP002', 
          email: email ? email.trim() : 'user@projectcamp.com', 
          role: 'admin'
        };
        const accessToken = 'mock-jwt-token-new';

        localStorage.setItem('token', accessToken);
        saveUserToStorage(user);

        set({ user, isAuthenticated: true, isLoading: false });
      }, 500);

    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Registration failed', 
        isLoading: false 
      });
    }
  },

  updateProfile: async ({ name, employeeId, email, avatar }) => {
    set({ isLoading: true, error: null });

    const currentUser = get().user || getStoredUser();
    const updatedUser = {
      ...currentUser,
      name: name !== undefined ? name.trim() : currentUser.name,
      employeeId: employeeId !== undefined ? employeeId.trim() : currentUser.employeeId,
      email: email !== undefined ? email.trim() : currentUser.email,
      avatar: avatar !== undefined ? avatar : currentUser.avatar,
    };

    saveUserToStorage(updatedUser);
    set({ user: updatedUser, isLoading: false });

    return { success: true, user: updatedUser };
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('pc_user');
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ user: null, isAuthenticated: false, isLoading: false });
      return;
    }

    set({ isLoading: true });
    try {
      const user = getStoredUser();
      set({ 
        user, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('pc_user');
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  }
}));

export default useAuthStore;
