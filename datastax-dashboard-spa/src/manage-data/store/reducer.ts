import { createSlice } from "@reduxjs/toolkit";

export interface ManageDataState {
    queryExecuting: boolean;
    queryExecutionTime: number | null;
    queryResult: any;
    queryInput: string;
}

const initialState: ManageDataState = {
    queryExecuting: false,
    queryExecutionTime: null,
    queryResult: undefined,
    queryInput: "",
}

const manageDataState = createSlice({

    name: "manageData",
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

export const manageDataActions = manageDataState.actions;
export const manageDataReducer = manageDataState.reducer;

export const { selectQueryExecuting, selectQueryExecutionTime, selectQueryResult, selectQueryInput } = manageDataState.selectors;
