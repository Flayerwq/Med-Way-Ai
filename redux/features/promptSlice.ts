import { createSlice } from "@reduxjs/toolkit";

interface Prompt {
  uuid: string;
  prompt: string;
  timestamp: string;
  thumbnail: string;
  fileSize: string;
  response: string;
  images: string[];
  pdf_url: string;
}

interface PromptState {
  history: Prompt[];
  isFetched: boolean;
}

const initialState: PromptState = {
  history: [],
  isFetched: false,
};

const promptSlice = createSlice({
  name: "prompts",
  initialState,
  reducers: {
    setPromptHistory(state, action) {
      state.history = action.payload;
      state.isFetched = true;
    },
    resetPromptHistory(state) {
      state.history = [];
      state.isFetched = false;
    },
  },
});

export const { setPromptHistory, resetPromptHistory } = promptSlice.actions;
export default promptSlice.reducer;
