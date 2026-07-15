import { createHttpClient } from "../../core/services/create-http-client.service";

const documentServiceClient = createHttpClient(
    "/api/documents", undefined);

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

export const documentService = {
    getDocumentById(query: any, pageState?: string) {
        const requestBody: any = {
            find: {
                filter: {
                    ...query
                }
            }
        };

        if (pageState) {
            requestBody.find.options = { pageState };
        }

        return documentServiceClient.post("", wrapRequestBody(requestBody));
    },
    addDocument(body: any): any {
        // Create the request body with the required structure
        const requestBody = {
            insertOne: {
                document: {
                    ...body
                },
            },
        };
        return documentServiceClient.post("", wrapRequestBody(requestBody));
    },
    updateDocument(id: string, body: any): any {
        // Create the request body with the required structure
        const requestBody = {
            updateOne: {
                filter: {
                    _id: id,
                },
                update: {
                    $set: {
                        ...body,
                    },
                },
            },
        };
        return documentServiceClient.post("", wrapRequestBody(requestBody));
    },
    deleteDocument(id: string): any {
        // Create the request body with the required structure
        const requestBody = {
            deleteOne: {
                filter: {
                    _id: id,
                },
            },
        };
        return documentServiceClient.post("", wrapRequestBody(requestBody));
    }
}