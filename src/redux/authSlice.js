// src/redux/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null, // Store only serializable user data
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    // In authSlice.js, modify loginSuccess:
loginSuccess: (state, action) => {
  const user = action.payload;
  state.user = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || '',
    photoURL: user.photoURL || '',
    emailVerified: user.emailVerified || false
  };
  state.loading = false;
  state.error = null;
},
    loginFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, setUser } = authSlice.actions;
export default authSlice.reducer;