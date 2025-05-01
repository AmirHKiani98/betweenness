import { createSlice } from '@reduxjs/toolkit';

interface GraphState {
  isDrawingNode: boolean;
  isDrawingLink: boolean;
  selectedNode: string | null; // or NodeData if you prefer full object,
  x: number | null;
  y: number | null;
}

const initialState: GraphState = {
  isDrawingNode: false,
  isDrawingLink: false,
  selectedNode: null,
  x: null,
  y: null
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
    },
    setSelectedNode: (state, action) => {
      state.selectedNode = action.payload;
    },
    setX: (state, action) => {
      state.x = action.payload;
    },
    setY: (state, action) => {
      state.y = action.payload;
    },
    clearSelectedNode: (state) => {
      state.selectedNode = null;
    },
    
  },
});

export const { toggleDrawingNode, setDrawingNode, toggleDrawingLink, setDrawingLink, setSelectedNode, clearSelectedNode, setX, setY } = graphSlice.actions;
export default graphSlice.reducer;