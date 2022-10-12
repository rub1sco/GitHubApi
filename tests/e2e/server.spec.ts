import {
    describe,
    it,
    expect,
    jest
} from '@jest/globals'

import { get } from 'http' 

describe('server.ts connectivity tests', () => {
    it('server should be up and running and ready for client connections', async () => {
        get('http://127.0.0.1:8080/', async (res) => {
            await expect(res.statusCode).toBe(200)
        }).on('error', async (error) => {
            console.error(error.message)
        })
    });

    it('server is down and error should be thrown', () => {
        get('http://127.0.0.1:8080/', (res) => {
            console.error('status code: ', res.statusCode)
            }).on('error', async (error) => {
            await expect(error.name).toBe("Error")
        })
    })
});

describe('github connectivity tests', () => {
    it('server should be up and running and ready for client connections', () => {

    });

    it('server is down and error should be thrown', () => {

    })
});