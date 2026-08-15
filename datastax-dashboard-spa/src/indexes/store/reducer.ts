import { createSlice } from "@reduxjs/toolkit";

export interface IndexesState {
    fetchingIndexes: boolean;
    indexes: string[];
}

const initialState: IndexesState = {
    fetchingIndexes: false,
    indexes: []
}

const indexesState = createSlice({
    name: "indexes",
    initialState,
    reducers: {
        setFetchingIndexes(state, action) {
            return {
                ...state,
                fetchingIndexes: action.payload
            }
        },
        setIndexes(state, action) {
            return {
                ...state,
                fetchingIndexes: false,
                indexes: action.payload
            }
        }
    },
    selectors: {
        selectFetchingIndexes: (state): boolean => state.fetchingIndexes,
        selectIndexes: (state): string[] => state.indexes
    }
});


export const indexesActions = indexesState.actions;
export const indexesReducer = indexesState.reducer;

export const { selectFetchingIndexes, selectIndexes } = indexesState.selectors;