import { IncomingMessage, ServerResponse } from "http";

/**
 * Post request to Github API with user provided Github Repo URL
 * @param req <IncomingMessage> request from client
 * @param res <ServerResponse> response server will send to client
 */
export function gitRepoPostRequest(req: IncomingMessage, res: ServerResponse): void {
    console.log(req)
    req.read()
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({
        id: 1,
        number: 100,
        title: 'test title',
        author: 'joe cool',
        commit_count: 1
    }) + `\n${res.req}`);
}

/**
 * Get request to Github API without any user input
 * @param req 
 * @param res 
 */
export function gitRepoGetRequest(req: IncomingMessage, res: ServerResponse): void {
    console.log(req)
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({
        id: 1,
        number: 100,
        title: 'test title',
        author: 'joe cool',
        commit_count: 1
    }) + `\n${res.req}`);
}