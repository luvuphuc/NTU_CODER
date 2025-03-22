import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    roleID: null,
    token: null,
    coderName: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.roleID = action.payload.roleID;
      state.token = action.payload.token;
      state.coderName = action.payload.coderName;
    },
    logout: (state) => {
      state.user = null;
      state.roleID = null;
      state.token = null;
      state.coderName = null;
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
