import axios from "axios";

export function createHttpClient(baseURL: string, headers: any) {

    const client = axios.create({
        baseURL,
        headers,
    });

    return client;

}