import { createSlice } from '@reduxjs/toolkit';

interface GraphState {
  isDrawingNode: boolean;
  isDrawingLink: boolean;
  isRemovingNode: boolean;
  selectedNode: string | null; // or NodeData if you prefer full object,
  x: number | null;
  y: number | null;
}

const initialState: GraphState = {
  isDrawingNode: false,
  isDrawingLink: false,
  isRemovingNode: false,
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
      if(state.isDrawingNode){
        state.isRemovingNode = false;
        state.isDrawingLink = false;
      }
    },
    setDrawingNode: (state, action) => {
      state.isDrawingNode = action.payload;
    },
    toggleRemovingNode: (state) => {
      state.isRemovingNode = !state.isRemovingNode;
      if(state.isRemovingNode){
        state.isDrawingNode = false;
        state.isDrawingLink = false;
      }
    },
    setRemovingNode: (state, action) => {
      state.isRemovingNode = action.payload
    },

    toggleDrawingLink: (state) => {
      state.isDrawingLink = !state.isDrawingLink;
      if(state.isDrawingLink){
        state.isRemovingNode = false;
        state.isDrawingNode = false;
      }
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

export const { toggleDrawingNode, setDrawingNode, toggleRemovingNode, setRemovingNode, toggleDrawingLink, setDrawingLink, setSelectedNode, clearSelectedNode, setX, setY } = graphSlice.actions;
export default graphSlice.reducer;