import { createSlice } from "@reduxjs/toolkit"

export interface DocumentsState {
    createPending: boolean;
    updatePending: boolean;
    deletePending: boolean;
    fetching: boolean;
    fetchTime: number | null;
    searchQuery: {};
    documents: any[];
    isAddDocumentRequested: boolean;
    addDocumentRequestBody: string;
    isUpdateDocumentRequested: boolean;
    isDeleteDocumentRequested: boolean;
    selectedDocument: any;
    updateDocumentRequestBody: string;
}

const initialState: DocumentsState = {
    createPending: false,
    updatePending: false,
    deletePending: false,
    fetching: false,
    fetchTime: null,
    searchQuery: undefined,
    documents: [],
    isAddDocumentRequested: false,
    addDocumentRequestBody: "",
    isUpdateDocumentRequested: false,
    isDeleteDocumentRequested: false,
    selectedDocument: null,
    updateDocumentRequestBody: ""
}

const documentsState = createSlice({
    name: "documents",
    initialState,
    reducers: {
        setSearchQuery(state, action) {
            state.searchQuery = action.payload
        },
        setFetching(state, action) {
            state.fetching = action.payload
        },
        setFetchTime(state, action) {
            state.fetchTime = action.payload
        },
        setDocuments(state, action) {
            state.documents = action.payload?.data?.documents
        },
        setCreatePending(state, action) {
            state.createPending = action.payload
        },
        setUpdatePending(state, action) {
            state.updatePending = action.payload
        },
        setDeletePending(state, action) {
            state.deletePending = action.payload
        },
        addDocumentRequested(state) {
            state.isAddDocumentRequested = true
        },
        addDocumentSuccess(state) {
            state.isAddDocumentRequested = false
            state.addDocumentRequestBody = ""
        },
        setAddDocumentRequestBody(state, action) {
            state.addDocumentRequestBody = action.payload
        },
        updateDocumentRequested(state, action) {
            state.isUpdateDocumentRequested = true
            state.selectedDocument = action.payload
            // Initialize update body with document data excluding _id
            const { _id, ...dataWithoutId } = action.payload
            state.updateDocumentRequestBody = JSON.stringify(dataWithoutId, null, 2)
        },
        updateDocumentSuccess(state) {
            state.isUpdateDocumentRequested = false
            state.selectedDocument = null
            state.updateDocumentRequestBody = ""
        },
        setUpdateDocumentRequestBody(state, action) {
            state.updateDocumentRequestBody = action.payload
        },
        deleteDocumentRequested(state, action) {
            state.isDeleteDocumentRequested = true
            state.selectedDocument = action.payload
        },
        deleteDocumentSuccess(state) {
            state.isDeleteDocumentRequested = false
            state.selectedDocument = null
        },
        resetDocumentsStore() {
            // Reset to initial state by returning it
            return initialState;
        },
    },
    selectors: {
        selectDocuments: (state) => state.documents,
        selectFetching: (state) => state.fetching,
        selectFetchTime: (state) => state.fetchTime,
        selectSearchQuery: (state) => state.searchQuery,
        selectCreatePending: (state) => state.createPending,
        selectUpdatePending: (state) => state.updatePending,
        selectDeletePending: (state) => state.deletePending,
        selectIsAddDocumentRequested: (state) => state.isAddDocumentRequested,
        selectAddDocumentRequestBody: (state) => state.addDocumentRequestBody,
        selectIsUpdateDocumentRequested: (state) => state.isUpdateDocumentRequested,
        selectIsDeleteDocumentRequested: (state) => state.isDeleteDocumentRequested,
        selectSelectedDocument: (state) => state.selectedDocument,
        selectUpdateDocumentRequestBody: (state) => state.updateDocumentRequestBody,
    }
});

export const documentsActions = documentsState.actions;
export const documentsReducer = documentsState.reducer;

// Export selectors from the slice - these automatically handle the root state
export const {
    selectDocuments,
    selectFetching,
    selectFetchTime,
    selectSearchQuery,
    selectCreatePending,
    selectUpdatePending,
    selectDeletePending,
    selectIsAddDocumentRequested,
    selectAddDocumentRequestBody,
    selectIsUpdateDocumentRequested,
    selectIsDeleteDocumentRequested,
    selectSelectedDocument,
    selectUpdateDocumentRequestBody } = documentsState.selectors;