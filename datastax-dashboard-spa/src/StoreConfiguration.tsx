import { configureStore } from "@reduxjs/toolkit";
import { documentsReducer } from "../src/documents/store/reducer";
import { coreReducer } from "./core/store/reducer";

const store = configureStore({
  reducer: {
    documents: documentsReducer,
    core: coreReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
