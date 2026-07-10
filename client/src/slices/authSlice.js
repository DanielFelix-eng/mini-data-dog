import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  userId: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // LOGIN
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.userId = action.payload.userId || action.payload?.user?._id || null;
      state.isAuthenticated = true;
      state.error = null;
    },

    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // SIGNUP
    signupStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    signupSuccess: (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.userId = action.payload.userId || action.payload?.user?._id || null;
      state.isAuthenticated = true;
      state.error = null;
    },

    signupFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // UPDATE USER
    updateUser: (state, action) => {
      state.user = action.payload;
    },

    // LOGOUT
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.userId = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },

    // CLEAR ERROR
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  signupStart,
  signupSuccess,
  signupFailure,
  updateUser,
  logout,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;