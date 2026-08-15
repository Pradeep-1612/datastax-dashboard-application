import { configureStore } from "@reduxjs/toolkit";
import { documentsReducer } from "../src/documents/store/reducer";
import { coreReducer } from "./core/store/reducer";
import { queryEditorReducer } from "./query-editor/store/reducer";
import { indexesReducer } from './indexes/store/reducer';

const store = configureStore({
  reducer: {
    documents: documentsReducer,
    core: coreReducer,
    queryEditor: queryEditorReducer,
    indexes: indexesReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
