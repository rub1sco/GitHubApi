import { IncomingMessage, ServerResponse } from "http";

export function rootGetRequest(req: IncomingMessage, res: ServerResponse): void {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({}));
}

export function invalidRequest(req: IncomingMessage, res: ServerResponse): void {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'endpoint not yet supported.' }))
}