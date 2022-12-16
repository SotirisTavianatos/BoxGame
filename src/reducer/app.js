import { createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
    name: "app",
    initialState: {
        assetsAreLoaded: false
    },
    reducers: {
        assetsAreLoaded: (state) => {
            state.assetsAreLoaded = true;
        }
    }
});

export const { assetsAreLoaded } = appSlice.actions;
export default appSlice.reducer;

