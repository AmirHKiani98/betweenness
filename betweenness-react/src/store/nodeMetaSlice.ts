import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface NodeMetaRow {
  id: string;
  type: string;
  longitude: number;
  latitude: number;
  elevation: number;
}

interface NodeMetaState {
  openModal: boolean;
  rows: NodeMetaRow[];
}

const initialState: NodeMetaState = {
  openModal: false,
  rows: [],
};

export const nodeMetaSlice = createSlice({
  name: "nodeMeta",
  initialState,
  reducers: {
    setOpenNodeMetaModal(state, action: PayloadAction<boolean>) {
      state.openModal = action.payload;
    },
    setNodeMetaRows(state, action: PayloadAction<NodeMetaRow[]>) {
      state.rows = action.payload;
    },
    updateNodeMetaRow(
      state,
      action: PayloadAction<{
        index: number;
        key: keyof NodeMetaRow;
        value: string | number;
      }>
    ) {
      const { index, key, value } = action.payload;
      if (state.rows[index]) {
        state.rows[index][key] = value as never;
      }
    },
    addNodeMetaRow(state) {
      state.rows.push({
        id: crypto.randomUUID(),
        type: "source",
        longitude: 0,
        latitude: 0,
        elevation: 0,
      });
    },
    removeNodeMetaRow(state, action: PayloadAction<number>) {
      state.rows.splice(action.payload, 1);
    },
  },
});

export const {
  setOpenNodeMetaModal,
  setNodeMetaRows,
  updateNodeMetaRow,
  addNodeMetaRow,
  removeNodeMetaRow,
} = nodeMetaSlice.actions;

export default nodeMetaSlice.reducer;
