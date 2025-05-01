import { configureStore } from '@reduxjs/toolkit';
import graphReducer from './graphSlice';
import flowReducer from './flowSlice';
import linkReducer from './linkSlice';

export const store = configureStore({
  reducer: {
    graph: graphReducer,
    flow: flowReducer,
    links: linkReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;