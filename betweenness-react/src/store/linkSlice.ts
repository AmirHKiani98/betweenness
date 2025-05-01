import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface LinkRow {
  id: string;
  type: string;
  source: string;
  dest: string;
  length: number;
  ffspd: number;
  capacity: number;
  num_lanes: number;
}

interface LinkState {
  openModal: boolean;
  rows: LinkRow[];
}

const initialState: LinkState = {
  openModal: false,
  rows: [],
};

export const linkSlice = createSlice({
  name: "links",
  initialState,
  reducers: {
    setOpenLinkModal(state, action: PayloadAction<boolean>) {
      state.openModal = action.payload;
    },
    setLinkRows(state, action: PayloadAction<LinkRow[]>) {
      state.rows = action.payload;
    },
    updateLinkRow(
      state,
      action: PayloadAction<{
        index: number;
        key: keyof LinkRow;
        value: string | number;
      }>
    ) {
      const { index, key, value } = action.payload;
      if (state.rows[index]) {
        // @ts-expect-error TS is too strict for dynamic keys here
        state.rows[index][key] = value;
      }
    },
    addLinkRow(state) {
      state.rows.push({
        id: crypto.randomUUID(),
        type: "ctm",
        source: "",
        dest: "",
        length: 0,
        ffspd: 0,
        capacity: 0,
        num_lanes: 1,
      });
    },
    removeLinkRow(state, action: PayloadAction<number>) {
      state.rows.splice(action.payload, 1);
    },
  },
});

export const {
  setOpenLinkModal,
  setLinkRows,
  updateLinkRow,
  addLinkRow,
  removeLinkRow,
} = linkSlice.actions;

export default linkSlice.reducer;
