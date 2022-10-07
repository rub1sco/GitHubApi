import { 
    createServer, 
    IncomingMessage, 
    Server, 
    ServerResponse } from 'http';
import { rootGetRequest, invalidRequest } from './routes/misc_routes';
import { gitRepoPostRequest, gitRepoGetRequest } from './routes/gitrepo';
const port: number = 8080;
const host: string = '0.0.0.0'

const server: Server = createServer((req: IncomingMessage, res: ServerResponse) => {
    if(req.url === '/' && req.method === 'GET') {
        rootGetRequest(req, res);
    } else if (req.url === '/git' && req.method === 'GET') {
        gitRepoGetRequest(req, res);
    } else if (req.url === '/git' && req.method === 'POST') {
        gitRepoPostRequest(req, res);
    }
    else {
        invalidRequest(req, res);
    }
});

server.listen(port, host);