import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import examReducer from './examSlice';
import proctoringReducer from './proctoringSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    exam: examReducer,
    proctoring: proctoringReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
