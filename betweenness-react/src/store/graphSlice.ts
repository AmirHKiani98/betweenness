import { createSlice } from '@reduxjs/toolkit';
export type RootState = {
  graph: {
      isDrawingNode: boolean;
      isDrawingLine: boolean;
      isRemovingNode: boolean;
      isRemovingLine: boolean;
      hoveredLineId: string;
      timeInterval: number;
      jamDensity: number;
      duration: number;
      allPoints: Array<{ id: string; x: number; y: number }>;
      allLinks: Array<{ id: string; from: string; to: string }>;
      x: number | null;
      y: number | null;
  };
};
interface GraphState {
  isDrawingNode: boolean;
  isDrawingLine: boolean;
  isRemovingNode: boolean;
  isRemovingLine: boolean;
  hoveredLineId: string;
  jamDensity: number;
  duration: number;
  allPoints: Array<{ id: string; x: number; y: number }>;
  timeInterval: number;
  allLinks: Array<{ id: string; from: string; to: string }>;
  selectedNode: string | null; // or NodeData if you prefer full object,
  x: number | null;
  y: number | null;
}

const initialState: GraphState = {
  isDrawingNode: false,
  isDrawingLine: false,
  isRemovingNode: false,
  isRemovingLine: false,
  timeInterval: 10,
  jamDensity:150,
  duration: 7200,
  hoveredLineId: '',
  allPoints: [],
  allLinks: [],
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
    setLineIdDisplay: (state, action) => {
      state.hoveredLineId = action.payload;
    },
    addPoint: (state, action) => {
      const point = action.payload;
      state.allPoints.push(point);
    },
    removePoint: (state, action) => {
      const pointId = action.payload;
      state.allPoints = state.allPoints.filter(p => p.id !== pointId);
    },
    addLink: (state, action) => {
      const link = action.payload;
      state.allLinks.push(link);
    },
    removeLink: (state, action) => {
      const linkId = action.payload;
      state.allLinks = state.allLinks.filter(l => l.id !== linkId);
    },
    setTimeInterval: (state, action) => {
      state.timeInterval = action.payload;
    },
    setJamDensity: (state, action) => {
      state.jamDensity = action.payload;
    },
    setDuration: (state, action) => {
      state.duration = action.payload;
    }


    
  },
});

export const { toggleDrawingNode, setDrawingNode, toggleRemovingNode, setRemovingNode, toggleDrawingLine, setDrawingLine, toggleRemovingLine, setRemovingLine, clearSelectedNode, setX, setY, setLineIdDisplay,  addPoint, removePoint, addLink, removeLink, setTimeInterval, setJamDensity, setDuration} = graphSlice.actions;
export default graphSlice.reducer;