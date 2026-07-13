import { configureStore } from '@reduxjs/toolkit';
import taskReducer from '../features/taskSlice.ts';

// Create and configure the Redux store
export const store = configureStore({
  reducer: {
    tasks: taskReducer,
  },
});

// TypeScript types for store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;