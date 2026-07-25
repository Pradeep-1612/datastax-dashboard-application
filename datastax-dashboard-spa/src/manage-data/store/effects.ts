import { coreActions } from "../../core/store/reducer";
import type { AppDispatch } from "../../StoreConfiguration"
import { manageDataService } from "../services/manage-data.service";
import { manageDataActions } from "./reducer"

export const executeQuery = (query: any) => {
    return async (dispatch: AppDispatch) => {

        dispatch(manageDataActions.setQueryExecutionDetails({ queryExecuting: true }));
        const startTime = performance.now();
        try {
            const result = await manageDataService.executeQuery(query);
            const endTime = performance.now();
            const fetchTime = endTime - startTime;
            dispatch(manageDataActions.setQueryExecutionDetails({
                queryExecuting: false,
                queryExecutionTime: fetchTime,
                queryResult: result.data
            }));
        }
        catch (error) {
            console.log(error);
            dispatch(manageDataActions.setQueryExecutionDetails({ queryExecuting: false }));
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