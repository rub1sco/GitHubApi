import {
  describe,
  it,
  expect
} from '@jest/globals'
import {
  MockRequestOptions,
  MockResponseOptions,
  Request,
  Response
} from 'mock-http'
import { invalidRequest, rootGetRequest } from '../../routes/misc_routes'

describe('misc_routes tests', () => {
  it('should get root get request', () => {
    const reqOptions: MockRequestOptions = {
      url: '/',
      method: 'GET'
    }
    const resOptions: MockResponseOptions = {}
    const req = new Request(reqOptions)
    const res = new Response(resOptions)
    expect(res.statusCode).toBeFalsy()
    rootGetRequest(req, res)
    expect(res.statusCode).toBe(200)
  })

  it('should send invalid page response', () => {
    const reqOptinos: MockRequestOptions = {
      url: '/',
      method: 'GET'
    }
    const resOptions: MockResponseOptions = {}
    const req = new Request(reqOptinos)
    const res = new Response(resOptions)
    expect(res.statusCode).toBeFalsy()
    invalidRequest(req, res)
    expect(res.statusCode).toBe(404)
  })
})
