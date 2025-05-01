import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FlowRow {
  node: number;
  start: number;
  end: number;
  rate: number;
}

interface FlowState {
  openModal: boolean;
  rows: FlowRow[];
}

const initialState: FlowState = {
  openModal: false,
  rows: [
    { node: 1, start: 0, end: 720, rate: 1100 },
    { node: 1, start: 720, end: 1800, rate: 200 },
  ],
};

export const flowSlice = createSlice({
  name: 'flow',
  initialState,
  reducers: {
    setOpenModal(state, action: PayloadAction<boolean>) {
      state.openModal = action.payload;
    },
    updateRow(state, action: PayloadAction<{ index: number; key: keyof FlowRow; value: number }>) {
      const { index, key, value } = action.payload;
      if (state.rows[index]) {
        state.rows[index][key] = value;
      }
    },
    addRow(state) {
      state.rows.push({ node: 0, start: 0, end: 0, rate: 0 });
    },
    removeRow(state, action: PayloadAction<number>) {
      state.rows.splice(action.payload, 1);
    },
    setRows: (state, action) => {
      state.rows = action.payload;
    }
  },
});

export const { setOpenModal, updateRow, addRow, removeRow, setRows } = flowSlice.actions;
export default flowSlice.reducer;