import { createSlice } from "@reduxjs/toolkit";

import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "..";

const initialState: Markdown = {
  id: null,
  title: null,
  content: null,
};

export const markdownSlice = createSlice({
  name: "markdown",
  initialState,
  reducers: {
    setMarkdown: (state, action: PayloadAction<Markdown>) => {
      state = action.payload;
    },
    setId: (state, action: PayloadAction<number | null>) => {
      state.id = action.payload;
    },
  },
});

export const { setMarkdown } = markdownSlice.actions;
export const selectMarkdown = (state: RootState) => state.markdown;

export default markdownSlice.reducer;
