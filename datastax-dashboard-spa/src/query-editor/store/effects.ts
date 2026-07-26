import { coreActions } from "../../core/store/reducer";
import type { AppDispatch } from "../../StoreConfiguration"
import { queryEditorService } from "../services/query-editor.service";
import { queryEditorActions } from "./reducer"

export const executeQuery = (query: any) => {
    return async (dispatch: AppDispatch) => {

        dispatch(queryEditorActions.setQueryExecutionDetails({ queryExecuting: true }));
        const startTime = performance.now();
        try {
            const result = await queryEditorService.executeQuery(query);
            const endTime = performance.now();
            const fetchTime = endTime - startTime;
            dispatch(queryEditorActions.setQueryExecutionDetails({
                queryExecuting: false,
                queryExecutionTime: fetchTime,
                queryResult: result.data
            }));
        }
        catch (error) {
            console.log(error);
            dispatch(queryEditorActions.setQueryExecutionDetails({ queryExecuting: false }));
            dispatch(
                coreActions.setErrorDetails({
                    messageId: "SOMETHING_WENT_WRONG",
                    shortText: "Unexpected error encountered",
                    explanation: "We were unable to complete your request due to an unexpected error.",
                    messageType: "ERROR",
                    userAction: "Please try again later. If the issue persists, contact your administrator."
                })
            );
        }

    }
}