import {
  describe,
  it,
  expect
} from '@jest/globals'
import {
  MockRequestOptions,
  Response
} from 'mock-http'
import { updateHeadersAndSendResponseData } from '../../routes/route_utils'

describe('route utils tests', () => {
  it('should update headers and send 200 response with data', () => {
    const reqOptions: MockRequestOptions = {}
    const res = new Response(reqOptions)
    expect(res.statusCode).toBeFalsy()
    updateHeadersAndSendResponseData(200, {}, res)
    expect(res.statusCode).toBe(200)
    expect(res.getHeaders()['content-type']).toBe('application/json')
  })

  it('should update headers and send 400 response with error data', () => {
    const reqOptions: MockRequestOptions = {}
    const res = new Response(reqOptions)
    expect(res.statusCode).toBeFalsy()
    updateHeadersAndSendResponseData(400, {}, res)
    expect(res.statusCode).toBe(400)
    expect(res.getHeaders()['content-type']).toBe('application/json')
  })
})
