import { IncomingMessage, ServerResponse } from 'http'
import { ErrorResponse } from '../api/types'
import { updateHeadersAndSendResponseData } from './route_utils'

/**
 * navigate to the root of web page. Currently just returns {} as response body. However, this can be modified if
 * new features are requested
 *
 * @param req <IncomingMessage> request from client
 * @param res <ServerResponse> response object to send to client
 */
export function rootGetRequest (req: IncomingMessage, res: ServerResponse): void {
  updateHeadersAndSendResponseData(200, {}, res)
}

/**
 * function to handle all invalid requests and return a 404 error with text 'endpoint not yet supported'
 *
 * @param req <IncomingMessage> request from client
 * @param res <ServerResponse> response object to send to client
 */
export function invalidRequest (req: IncomingMessage, res: ServerResponse): void {
  const errorResponse: ErrorResponse = { error: 'endpoint not yet supported.' }
  updateHeadersAndSendResponseData(404, errorResponse, res)
}
