import { createSlice } from '@reduxjs/toolkit';

interface GraphState {
  isDrawingNode: boolean;
}

const initialState: GraphState = {
  isDrawingNode: false,
};

const graphSlice = createSlice({
  name: 'graph',
  initialState,
  reducers: {
    toggleDrawingNode: (state) => {
      state.isDrawingNode = !state.isDrawingNode;
    },
    setDrawingNode: (state, action) => {
      state.isDrawingNode = action.payload;
    },
  },
});

export const { toggleDrawingNode, setDrawingNode } = graphSlice.actions;
export default graphSlice.reducer;