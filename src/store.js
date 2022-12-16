import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./reducer/app";
import loadingReducer from "./reducer/loading";

export const store = configureStore({
    devTools: true,
    reducer: {
        app: appReducer,
        loading: loadingReducer
    }
});
