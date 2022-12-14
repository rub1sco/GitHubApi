import {
  createServer,
  IncomingMessage,
  Server,
  ServerResponse
} from 'http'
import { rootGetRequest, invalidRequest } from './routes/misc_routes'
import { gitRepoPostRequest } from './routes/gitrepo'
import internal from 'stream'
const port: string = process.env.PORT ?? '8080'

const server: Server = createServer((req: IncomingMessage, res: ServerResponse) => {
  if (req.url === '/' && req.method === 'GET') {
    rootGetRequest(req, res)
  } else if (req.url === '/git' && req.method === 'POST') {
    gitRepoPostRequest(req, res)
  } else {
    invalidRequest(req, res)
  }
})

server.on('clientError', (error: Error, socket: internal.Duplex) => {
  if (error.name === 'ECONNRESET' || !socket.writable) {
    return
  }

  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
})

server.on('close', () => {
  server.closeAllConnections()
})

server.listen(port)
