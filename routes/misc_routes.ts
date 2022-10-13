import { IncomingMessage, ServerResponse } from 'http'
import { ErrorResponse } from '../api/types'
import { updateHeadersAndSendResponseData } from './route_utils'

export function rootGetRequest (req: IncomingMessage, res: ServerResponse): void {
  updateHeadersAndSendResponseData(200, {}, res)
}

export function invalidRequest (req: IncomingMessage, res: ServerResponse): void {
  const errorResponse: ErrorResponse = { error: 'endpoint not yet supported.' }
  updateHeadersAndSendResponseData(404, errorResponse, res)
}
