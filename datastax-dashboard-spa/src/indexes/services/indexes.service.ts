import { createHttpClient } from "../../core/services/create-http-client.service";

const indexesServiceClient = createHttpClient(
    "/api/documents", undefined);

// Helper function to get configuration from sessionStorage
const getRequestConfiguration = () => {
    const urlKeyspace = sessionStorage.getItem('config_url_keyspace') || '';
    const headerName = sessionStorage.getItem('config_headerName') || '';
    const headerValue = sessionStorage.getItem('config_headerValue') || '';

    return {
        url: urlKeyspace,
        headerName,
        headerValue
    };
};

// Helper function to wrap request body with configuration
const wrapRequestBody = (requestBody: object) => {
    const requestConfigurationDetails = getRequestConfiguration();

    return {
        requestConfigurationDetails,
        requestBody
    };
};

export const indexesService = {
    getIndexes() {
        const requestBody = {
            "findCollections": {
                "options": {
                    "explain": true
                }
            }
        };

        return indexesServiceClient.post("", wrapRequestBody(requestBody));
    }
}