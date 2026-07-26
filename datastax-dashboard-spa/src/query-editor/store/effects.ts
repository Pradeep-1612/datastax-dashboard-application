import { coreActions } from "../../core/store/reducer";
import type { AppDispatch } from "../../StoreConfiguration"
import { queryEditorService } from "../services/query-editor.service";
import { queryEditorActions } from "./reducer"
const QUERY_HISTORY_KEY = "queryHistory";
const MAX_QUERY_HISTORY = 20;

function saveQueryToHistory(query: unknown, executionTime: number, success: boolean) {
    const existing: { query: string; executionTime: number; lastRunAt: string; success: boolean }[] =
        JSON.parse(localStorage.getItem(QUERY_HISTORY_KEY) ?? "[]");
    const queryString = typeof query === "string" ? query : JSON.stringify(query, null, 2);
    const entry = { query: queryString, executionTime, lastRunAt: new Date().toISOString(), success };
    const updated = [...existing, entry].slice(-MAX_QUERY_HISTORY);
    localStorage.setItem(QUERY_HISTORY_KEY, JSON.stringify(updated));
}

export const executeQuery = (query: unknown, signal?: AbortSignal) => {
    return async (dispatch: AppDispatch) => {

        dispatch(queryEditorActions.setQueryExecutionDetails({ queryExecuting: true }));
        const startTime = performance.now();
        try {
            const result = await queryEditorService.executeQuery(query, signal);
            const endTime = performance.now();
            const fetchTime = endTime - startTime;
            dispatch(queryEditorActions.setQueryExecutionDetails({
                queryExecuting: false,
                queryExecutionTime: fetchTime,
                queryResult: result.data
            }));
            saveQueryToHistory(query, fetchTime, true);
        }
        catch (error) {
            if ((error as { name?: string }).name === "CanceledError") {
                dispatch(queryEditorActions.setQueryExecutionDetails({ queryExecuting: false }));
                return;
            }
            const endTime = performance.now();
            const fetchTime = endTime - startTime;
            saveQueryToHistory(query, fetchTime, false);
            console.log(error);
            dispatch(queryEditorActions.setQueryExecutionDetails({ queryExecuting: false, queryExecutionTime: fetchTime }));
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