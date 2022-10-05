import { ServerResponse } from "http";

/**
 * update the status code of response object and appends the data to be sent 
 * to the client.
 * 
 * @param status <number> status code to be appended to response
 * @param data <any> data to be included with the response
 * @param res <ServerResponse> response object to send to client
 */
export function updateHeadersAndSendResponseData(status: number, data: any, res: ServerResponse): void {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
} 