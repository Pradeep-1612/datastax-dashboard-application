import { createSlice } from "@reduxjs/toolkit";

export interface QueryEditorState {
    queryExecuting: boolean;
    queryExecutionTime: number | null;
    queryResult: any;
    queryInput: string;
}

const initialState: QueryEditorState = {
    queryExecuting: false,
    queryExecutionTime: null,
    queryResult: undefined,
    queryInput: "",
}

const queryEditorState = createSlice({

    name: "queryEditor",
    initialState,
    reducers: {
        setQueryExecutionDetails(state, action) {
            const { queryExecuting, queryExecutionTime, queryResult } = action.payload;
            return {
                ...state,
                queryExecuting, queryExecutionTime, queryResult
            }
        },
        setQueryInput(state, action) {
            state.queryInput = action.payload;
        },
    },
    selectors: {
        selectQueryExecuting: (state): boolean => state.queryExecuting,
        selectQueryExecutionTime: (state) => state.queryExecutionTime,
        selectQueryResult: (state) => JSON.stringify(state.queryResult, null, 2),
        selectQueryInput: (state): string => state.queryInput,
    }
});

export const queryEditorActions = queryEditorState.actions;
export const queryEditorReducer = queryEditorState.reducer;

export const { selectQueryExecuting, selectQueryExecutionTime, selectQueryResult, selectQueryInput } = queryEditorState.selectors;
