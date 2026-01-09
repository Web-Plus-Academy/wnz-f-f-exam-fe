import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, UserInfo } from '@/types/exam';

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  hasReadInstructions: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<UserInfo>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.hasReadInstructions = false;
    },
    setHasReadInstructions: (state, action: PayloadAction<boolean>) => {
      state.hasReadInstructions = action.payload;
    },
  },
});

export const { login, logout, setHasReadInstructions } = authSlice.actions;
export default authSlice.reducer;
