import { configureStore } from '@reduxjs/toolkit';
import graphReducer from './graphSlice';
import flowReducer from './flowSlice';
import linkReducer from './linkSlice';
import nodeMetaReducer from './nodeMetaSlice';

export const store = configureStore({
  reducer: {
    graph: graphReducer,
    flow: flowReducer,
    links: linkReducer,
    nodeMeta: nodeMetaReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;