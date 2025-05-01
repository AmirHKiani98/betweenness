import { configureStore } from '@reduxjs/toolkit';
import graphReducer from './graphSlice';
import flowReducer from './flowSlice';

export const store = configureStore({
  reducer: {
    graph: graphReducer,
    flow: flowReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;