import { createHttpClient } from "../../core/services/create-http-client.service";

const queryEditorServiceClient = createHttpClient("/api/documents", undefined);


// Helper function to get configuration from sessionStorage
const getRequestConfiguration = () => {
    const url = sessionStorage.getItem('config_url') || '';
    const headerName = sessionStorage.getItem('config_headerName') || '';
    const headerValue = sessionStorage.getItem('config_headerValue') || '';

    if (!url || !headerName || !headerValue) {
        throw new Error('Configuration not found. Please configure URL, Header Name, and Header Value in the Configuration page.');
    }

    return {
        url,
        headerName,
        headerValue
    };
};

// Helper function to wrap request body with configuration
const wrapRequestBody = (requestBody: any) => {
    const requestConfigurationDetails = getRequestConfiguration();

    return {
        requestConfigurationDetails,
        requestBody
    };
};

export const queryEditorService = {
    executeQuery(query: any, signal?: AbortSignal) {
        return queryEditorServiceClient.post("", wrapRequestBody(query), { signal });
    }
}