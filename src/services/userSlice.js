import { createSlice, current } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  userCompanies: [],
  currentCompany: null,
  theme: {
    primaryColor: '#008080',
    headerBg: '#00505b',
    sidebarBg: '#ffffff',
    sidebarText: '#374151',
    mode: 'light' // or 'dark'
  },
  loading: false,
  error: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.userCompanies = action.payload.user?.userCompanies || [];
      state.loading = false;
      state.error = null;
    },
    setActiveCompany: (state, action) => {
      state.userCompanies = action.payload;
      
      if (state.user) {
        state.user.userCompanies = action.payload;
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    updateUserCompanies: (state, action) => {
      state.user.userCompanies = action.payload;
    },
    setCurrentCompany: (state, action) => {
      console.log(action.payload);
      state.currentCompany = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.userCompanies = null;
      state.currentCompany = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    },
    setTheme: (state, action) => {
      state.theme = { ...state.theme, ...action.payload };
    }
  }
});

export const {
  setUser,
  setActiveCompany,
  setLoading,
  setError,
  updateUser,
  updateUserCompanies,
  setCurrentCompany,
  logout,
  clearError,
  setTheme
} = userSlice.actions;

export default userSlice.reducer; 