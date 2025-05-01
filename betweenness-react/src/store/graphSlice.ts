import { createSlice } from '@reduxjs/toolkit';
export type RootState = {
  graph: {
      isDrawingNode: boolean;
      isDrawingLine: boolean;
      isRemovingNode: boolean;
      isRemovingLine: boolean;
      x: number | null;
      y: number | null;
  };
};
interface GraphState {
  isDrawingNode: boolean;
  isDrawingLine: boolean;
  isRemovingNode: boolean;
  isRemovingLine: boolean;
  selectedNode: string | null; // or NodeData if you prefer full object,
  x: number | null;
  y: number | null;
}

const initialState: GraphState = {
  isDrawingNode: false,
  isDrawingLine: false,
  isRemovingNode: false,
  isRemovingLine: false,
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
        state.isDrawingLine = false;
        state.isRemovingLine = false;
      }
    },
    setDrawingNode: (state, action) => {
      state.isDrawingNode = action.payload;
    },
    toggleRemovingNode: (state) => {
      state.isRemovingNode = !state.isRemovingNode;
      if(state.isRemovingNode){
        state.isDrawingNode = false;
        state.isDrawingLine = false;
        state.isRemovingLine = false;
      }
    },
    setRemovingNode: (state, action) => {
      state.isRemovingNode = action.payload
    },

    toggleDrawingLine: (state) => {
      state.isDrawingLine = !state.isDrawingLine;
      if(state.isDrawingLine){
        state.isRemovingNode = false;
        state.isDrawingNode = false;
        state.isRemovingLine = false;
      }
    },
    setDrawingLine: (state, action) => {
      state.isDrawingLine = action.payload;
    },
    toggleRemovingLine: (state) => {
      state.isRemovingLine = !state.isRemovingLine;
      if(state.isRemovingLine){
        state.isRemovingNode = false;
        state.isDrawingNode = false;
        state.isDrawingLine = false;
      }
    },

    setRemovingLine: (state, action) => {
      state.isRemovingLine = action.payload;
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

export const { toggleDrawingNode, setDrawingNode, toggleRemovingNode, setRemovingNode, toggleDrawingLine, setDrawingLine, toggleRemovingLine, setRemovingLine, clearSelectedNode, setX, setY } = graphSlice.actions;
export default graphSlice.reducer;