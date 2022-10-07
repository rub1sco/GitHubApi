import { IncomingMessage, ServerResponse, RequestOptions } from "http";
import { request } from 'https'
import { GithubRepoResponse } from "../api/types";
import { updateHeadersAndSendResponseData } from "./route_utils";

/**
 * Post request to Github API with user provided Github Repo URL
 * @param req <IncomingMessage> request from client
 * @param res <ServerResponse> response server will send to client
 */
export function gitRepoPostRequest(req: IncomingMessage, res: ServerResponse): void {
    // console.log(req)
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
    // console.log(req)
    getGithubResponse('https://api.github.com/repos/rub1sco/NodeCourseProjects').then((response: GithubRepoResponse) => {
        console.log('github response', response);
    });
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

/**
 * asynchronous function to get response from Github api
 * 
 * @param url sanitized repo url
 * @returns Github response object
 */
function getGithubResponse(url: string): Promise<GithubRepoResponse> {
    // https://github.com/rub1sco/GitHubApi

    // must contain a valid repo
    sanitizeUrl(url);

    const githubPromise: Promise<GithubRepoResponse> = new Promise((reject, resolve) => {
        const requestParams: RequestOptions = {
            hostname: 'api.github.com',
            path: '/repos/rub1sco/GitHubApi',
            method: 'GET',
            headers: {
                "User-Agent": 'rub1sco-GitHubApi',
                "Accept": "application/vnd.github+json",
                "Authorization": `Bearer ${process.env.GITHUB_AUTH}`
            }
        }

        let responseBody = ''
        const req = request(requestParams, (res: IncomingMessage) => {
            res.setEncoding('utf-8')
            res.on('data', (chunk: any) => {
                responseBody += chunk;
            });
            res.on('end', () => {
                console.log('end of stream. data received:', responseBody);

            });
            res.on('error', (error: Error) => {
                console.error('an error occured receving data from Github')
            });
        });

        req.on('error', (error: Error) => console.error('An error occured with the request.'))
        req.end();
    })

    return githubPromise;
}