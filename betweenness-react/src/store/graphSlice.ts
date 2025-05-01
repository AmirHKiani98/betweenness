import { createSlice } from '@reduxjs/toolkit';

interface GraphState {
  isDrawingNode: boolean;
  isDrawingLink: boolean;
}

const initialState: GraphState = {
  isDrawingNode: false,
  isDrawingLink: false,
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
    toggleDrawingLink: (state) => {
      state.isDrawingLink = !state.isDrawingLink;
    },
    setDrawingLink: (state, action) => {
      state.isDrawingLink = action.payload;
    }
  },
});

export const { toggleDrawingNode, setDrawingNode, toggleDrawingLink, setDrawingLink } = graphSlice.actions;
export default graphSlice.reducer;