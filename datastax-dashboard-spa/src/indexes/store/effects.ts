import { coreActions } from "../../core/store/reducer";
import type { AppDispatch } from "../../StoreConfiguration"
import { indexesService } from "../services/indexes.service";
import { indexesActions } from "./reducer"

export const indexesEffects = {
    getIndexes() {
        return async (dispatch: AppDispatch) => {
            dispatch(indexesActions.setFetchingIndexes(true));
            try {
                const response = await indexesService.getIndexes();
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
                console.log(response?.data)

                const targetCollection = sessionStorage.getItem('config_collection') || '';
                const collections: { name: string; options?: { indexing?: { allow?: string[] } } }[] =
                    response?.data?.status?.collections ?? [];
                const match = collections.find((c) => c.name === targetCollection);
                const allowedIndexes: string[] = match?.options?.indexing?.allow ?? [];

                 console.log(match)
                  console.log(allowedIndexes)

                dispatch(indexesActions.setIndexes(allowedIndexes));
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
                    indexesActions.setFetchingIndexes(false)
                );
            }

        }
    }
}