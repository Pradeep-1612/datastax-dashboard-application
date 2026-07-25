import { configureStore } from "@reduxjs/toolkit";
import { documentsReducer } from "../src/documents/store/reducer";
import { coreReducer } from "./core/store/reducer";
import { manageDataReducer } from "./manage-data/store/reducer";

const store = configureStore({
  reducer: {
    documents: documentsReducer,
    core: coreReducer,
    manageData: manageDataReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
