import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from './api/baseApi';
import './api/authApi';
import { listenerMiddleware } from './listeners';
import authReducer from './slices/authSlice';
import profileReducer from './slices/profileSlice';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
    profile: profileReducer,
  },
  middleware: (getDefault) =>
    getDefault().prepend(listenerMiddleware.middleware).concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
