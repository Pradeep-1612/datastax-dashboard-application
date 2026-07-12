import { createSlice } from "@reduxjs/toolkit"


interface ErrorDetails {
    messageId: string;
    shortText: string;
    explanation: string;
    messageType: string;
    userAction: string;
}
export interface CoreState {
    errorDetails: ErrorDetails;
}

const initialState: CoreState = {
    errorDetails: undefined,
}

const coreState = createSlice({
    name: "core",
    initialState,
    reducers: {
        setErrorDetails(state, action: { payload: ErrorDetails }) {
            state.errorDetails = action.payload
        },
    },
    selectors: {
        selectErrorDetails: (state) => state.errorDetails,
    }
});

export const coreActions = coreState.actions;
export const coreReducer = coreState.reducer;
export const { selectErrorDetails } = coreState.selectors;