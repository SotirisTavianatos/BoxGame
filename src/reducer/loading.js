import { createSlice } from "@reduxjs/toolkit";

const loadingSlice = createSlice({
    name: "loading",
    initialState: {
        progress: 0
    },
    reducers: {
        loadingProgress: (state, action) => {
            state.progress = action.payload.progress;
        }
    }
});

export const { loadingProgress } = loadingSlice.actions;
export default loadingSlice.reducer;

