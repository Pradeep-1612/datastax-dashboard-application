import type { AppDispatch } from "../../StoreConfiguration";
import { documentService } from "../services/document.service";
import { documentsActions } from "./reducer";
import { coreActions } from "../../core/store/reducer";

export const fetchDocuments = (query: any) => {
    return async (dispatch: AppDispatch) => {
        dispatch(
            documentsActions.setSearchQuery(query)
        );
        dispatch(
            documentsActions.setFetching(true)
        );

        const startTime = performance.now();

        try {
            const response = await documentService.getDocumentById(query);
            if (response?.data?.errors) {
                console.error("Error fetching document ", response);
                dispatch(
                    coreActions.setErrorDetails({
                        messageId: response?.data?.errors[0].errorCode,
                        shortText: response?.data?.errors[0].title,
                        explanation: response?.data?.errors[0].message,
                        messageType: 'ERROR',
                        userAction: 'For assistance, please contact your administrator.'
                    })
                );
            }
            dispatch(
                documentsActions.setDocuments(response.data)
            );

            const endTime = performance.now();
            const fetchTime = endTime - startTime;
            dispatch(
                documentsActions.setFetchTime(fetchTime)
            );
        } catch (error) {
            console.log(error);
            dispatch(
                coreActions.setErrorDetails({
                    messageId: "SOMETHING_WENT_WRONG",
                    shortText: "Unexpected error encountered",
                    explanation: "We were unable to complete your request due to an unexpected error.",
                    messageType: "ERROR",
                    userAction: "Please try again later. If the issue persists, contact your administrator."
                })
            );
        } finally {
            dispatch(
                documentsActions.setFetching(false)
            );
        }
    };
}

export const addDocument = (body: {}) => {
    return async (dispatch: AppDispatch) => {
        dispatch(
            documentsActions.setCreatePending(true)
        );

        try {
            const response = await documentService.addDocument(body);
            if (response?.data?.errors) {
                console.error("Error adding document ", response);
                dispatch(
                    coreActions.setErrorDetails({
                        messageId: response?.data?.errors[0].errorCode,
                        shortText: response?.data?.errors[0].title,
                        explanation: response?.data?.errors[0].message,
                        messageType: 'ERROR',
                        userAction: 'For assistance, please contact your administrator.'
                    })
                );
                return;
            }
            dispatch(
                documentsActions.setCreatePending(false)
            );
            // Dispatch success action to close the modal
            dispatch(
                documentsActions.addDocumentSuccess()
            );
        } catch (error) {
            console.log(error);
            dispatch(
                coreActions.setErrorDetails({
                    messageId: "SOMETHING_WENT_WRONG",
                    shortText: "Unexpected error encountered",
                    explanation: "We were unable to complete your request due to an unexpected error.",
                    messageType: "ERROR",
                    userAction: "Please try again later. If the issue persists, contact your administrator."
                })
            );
        } finally {
            dispatch(
                documentsActions.setCreatePending(false)
            );
        }
    };

}

export const updateDocument = (id: string, body: any) => {
    return async (dispatch: AppDispatch) => {
        dispatch(
            documentsActions.setUpdatePending(true)
        );

        try {
            const response = await documentService.updateDocument(id, body);
            if (response?.data?.errors) {
                console.error("Error updating document ", response);
                dispatch(
                    coreActions.setErrorDetails({
                        messageId: response?.data?.errors[0].errorCode,
                        shortText: response?.data?.errors[0].title,
                        explanation: response?.data?.errors[0].message,
                        messageType: 'ERROR',
                        userAction: 'For assistance, please contact your administrator.'
                    })
                );
            }
            dispatch(
                documentsActions.setUpdatePending(false)
            );
            // Dispatch success action to close the modal
            dispatch(
                documentsActions.updateDocumentSuccess()
            );
            // Dispatch fetchDocuments to refresh the data
            dispatch(fetchDocuments({ _id: id }));
        } catch (error) {
            console.log(error);
            dispatch(
                coreActions.setErrorDetails({
                    messageId: "SOMETHING_WENT_WRONG",
                    shortText: "Unexpected error encountered",
                    explanation: "We were unable to complete your request due to an unexpected error.",
                    messageType: "ERROR",
                    userAction: "Please try again later. If the issue persists, contact your administrator."
                })
            );
        } finally {
            dispatch(
                documentsActions.setUpdatePending(false)
            );
        }
    };

}

export const deleteDocument = (id: string) => {
    return async (dispatch: AppDispatch) => {
        dispatch(
            documentsActions.setDeletePending(true)
        );

        try {
            const response = await documentService.deleteDocument(id);
            if (response?.data?.errors) {
                console.error("Error deleting document ", response);
                dispatch(
                    coreActions.setErrorDetails({
                        messageId: response?.data?.errors[0].errorCode,
                        shortText: response?.data?.errors[0].title,
                        explanation: response?.data?.errors[0].message,
                        messageType: 'ERROR',
                        userAction: 'For assistance, please contact your administrator.'
                    })
                );
            }
            dispatch(
                documentsActions.setDeletePending(false)
            );
            // Dispatch fetchDocuments to refresh the data
            dispatch(fetchDocuments({ _id: id }));
            // Dispatch success action to close the modal
            dispatch(
                documentsActions.deleteDocumentSuccess()
            );
        } catch (error) {
            console.log(error);
            dispatch(
                coreActions.setErrorDetails({
                    messageId: "SOMETHING_WENT_WRONG",
                    shortText: "Unexpected error encountered",
                    explanation: "We were unable to complete your request due to an unexpected error.",
                    messageType: "ERROR",
                    userAction: "Please try again later. If the issue persists, contact your administrator."
                })
            );
        } finally {
            dispatch(
                documentsActions.setDeletePending(false)
            );
        }
    };

}