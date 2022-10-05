import { IncomingMessage, ServerResponse } from "http";
import { GithubRepoResponse } from "../api/types";
import { updateHeadersAndSendResponseData } from "./route_utils";

/**
 * Post request to Github API with user provided Github Repo URL
 * @param req <IncomingMessage> request from client
 * @param res <ServerResponse> response server will send to client
 */
export function gitRepoPostRequest(req: IncomingMessage, res: ServerResponse): void {
    console.log(req)
    const testResponse: GithubRepoResponse = {
        id: 1,
        number: 100,
        title: 'test title',
        author: 'joe cool',
        commit_count: 1
    };
    updateHeadersAndSendResponseData(200, testResponse, res);
}

/**
 * Get request to Github API without any user input
 * @param req 
 * @param res 
 */
export function gitRepoGetRequest(req: IncomingMessage, res: ServerResponse): void {
    console.log(req)
    const testResponse: GithubRepoResponse = {
        id: 1,
        number: 100,
        title: 'test title',
        author: 'joe cool',
        commit_count: 1
    };
    updateHeadersAndSendResponseData(200, testResponse, res);
}

/**
 * Function to sanitize any malformed url string entered by the user.
 * @param url user entered url
 * @returns valid url string.
 */
function sanitizeUrl(url: string): string {
    
    return '';
}