import {
  describe,
  it,
  expect,
  jest
} from '@jest/globals'
import { rejects } from 'assert'

import { get, IncomingMessage, request } from 'http'
import { get as secureGet, RequestOptions } from 'https'
import path from 'path'

require('dotenv').config()

describe('server.ts connectivity tests', () => {
  it('server should be up and running and ready for client connections', async () => {
    await expect(new Promise((resolve, reject) => {
      get('http://127.0.0.1:8080/', async (res) => {
        resolve(res.statusCode)
      }).on('error', (error) => {
      })
    })).resolves.toBe(200)
  })

  it('server online: user navigated to /git and posted a request for nodejs/node', async () => {
    await expect(new Promise((resolve, reject) => {
      let responseObject = ''
      const req = request({
        host: '127.0.0.1',
        port: 8080,
        path: '/git',
        method: 'POST'

      } as RequestOptions, (res: IncomingMessage) => {
        res.on('data', (chunk) => {
          responseObject += chunk
        })

        res.on('error', (error: Error) => {
          reject(error.message)
        })

        res.on('end', async () => {
          resolve(JSON.parse(responseObject).length)
        })
      })

      req.write(JSON.stringify({
        url: 'www.github.com/nodejs/node'
      }))
      req.end()
    })).resolves.toBeGreaterThan(1)
  })

  it('server online: user navigated to /git and posted an invalid request: wrong host', async () => {
    await expect(new Promise((resolve, reject) => {
      let responseObject = ''
      const req = request({
        host: '127.0.0.1',
        port: 8080,
        path: '/git',
        method: 'POST'

      } as RequestOptions, (res: IncomingMessage) => {
        res.on('data', (chunk) => {
          responseObject += chunk
        })

        res.on('error', (error: Error) => {
          reject(error.message)
        })

        res.on('end', async () => {
          resolve(JSON.parse(responseObject).error)
        })
      })

      req.write(JSON.stringify({
        url: 'www.google.com/nodejs/node'
      }))
      req.end()
    })).resolves.toBe('Invalid Github url- www.google.com/nodejs/node')
  })

  it('server online: user navigated to /git and posted an invalid request: space in address', async () => {
    await expect(new Promise((resolve, reject) => {
      let responseObject = ''
      const req = request({
        host: '127.0.0.1',
        port: 8080,
        path: '/git',
        method: 'POST'

      } as RequestOptions, (res: IncomingMessage) => {
        res.on('data', (chunk) => {
          responseObject += chunk
        })

        res.on('error', (error: Error) => {
          reject(error.message)
        })

        res.on('end', async () => {
          resolve(JSON.parse(responseObject).length)
        })
      })

      req.write(JSON.stringify({
        url: 'www.github.com/n odejs/node'
      }))
      req.end()
    })).resolves.toBeGreaterThan(1)
  })

  it('server online: user navigated to /git and posted an invalid request: // in address', async () => {
    await expect(new Promise((resolve, reject) => {
      let responseObject = ''
      const req = request({
        host: '127.0.0.1',
        port: 8080,
        path: '/git',
        method: 'POST'

      } as RequestOptions, (res: IncomingMessage) => {
        res.on('data', (chunk) => {
          responseObject += chunk
        })

        res.on('error', (error: Error) => {
          reject(error.message)
        })

        res.on('end', async () => {
          resolve(JSON.parse(responseObject).message)
        })
      })

      req.write(JSON.stringify({
        url: 'www.github.com//node'
      }))
      req.end()
    })).resolves.toBe('Not Found')
  })

  it('server is down and error should be thrown', async () => {
    await expect(new Promise((resolve, reject) => {
      get('http://127.0.0.1:8080/', (res) => {
        resolve(res)
      }).on('error', (error) => {
        reject(error.message.includes('ECONNREFUSED'))
      })
    })).rejects.toBeTruthy()
  })
})

describe('github api connectivity tests', () => {
  it('github server should be up and running and ready for client connections', async () => {
    await expect(new Promise((resolve, reject) => {
      const reqOptions: RequestOptions = {
        host: 'api.github.com',
        path: '',
        method: 'GET',
        headers: {
          'User-Agent': 'rub1sco-GitHubApi',
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${process.env.GITHUB_AUTH}`
        }
      }
      secureGet(reqOptions, (res) => {
        resolve(res.statusCode)
      }).on('error', (error) => {
        reject(error.message)
      })
    })).resolves.toBe(200)
  })

  it('server is down and error should be thrown', async () => {
    await expect(new Promise((resolve, reject) => {
      const reqOptions: RequestOptions = {
        host: 'api.github.com',
        path: '',
        method: 'GET',
        headers: {
          'User-Agent': 'rub1sco-GitHubApi',
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${process.env.GITHUB_AUTH}`
        }
      }
      secureGet(reqOptions, (res) => {
        resolve(res.statusCode)
      }).on('error', (error) => {
        reject(error.message.includes('ECONNREFUSED'))
      })
    })).rejects.toBeTruthy()
  })
})
