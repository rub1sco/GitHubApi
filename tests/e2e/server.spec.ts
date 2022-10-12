import {
    describe,
    it,
    expect,
    jest
} from '@jest/globals'

import { get } from 'http' 
import { get as secureGet, RequestOptions } from 'https';
import path from 'path';

require('dotenv').config()

describe('server.ts connectivity tests', () => {
    it('server should be up and running and ready for client connections', () => {
         get('http://127.0.0.1:8080/', async (res) => {
            await expect(res.statusCode).toBe(200)
        }).on('error', (error) => {
        })
    });

    it('server is down and error should be thrown', () => {
        get('http://127.0.0.1:8080/', (res) => {
            }).on('error', async (error) => {
            await expect(error.name).toBe("Error")
        })
    })
});

describe('github api connectivity tests', () => {
    it('server should be up and running and ready for client connections', () => {
        const reqOptions: RequestOptions = {
            host: 'api.github.com',
            path: '',
            method: 'GET',
            headers: {
                "User-Agent": 'rub1sco-GitHubApi',
                "Accept": "application/vnd.github+json",
                "Authorization": `Bearer ${process.env.GITHUB_AUTH}`
            }
        }
        secureGet(reqOptions, async (res) => {
            await expect(res.statusCode).toBe(200)
        }).on('error', async (error) => {
        })
    });

    it('server is down and error should be thrown', () => {
        const reqOptions: RequestOptions = {
            host: 'api.github.com',
            path: '',
            method: 'GET',
            headers: {
                "User-Agent": 'rub1sco-GitHubApi',
                "Accept": "application/vnd.github+json",
                "Authorization": `Bearer ${process.env.GITHUB_AUTH}`
            }
        }
        secureGet(reqOptions, (res) => {
        }).on('error', async (error) => {
            await expect(error.name).toBe('Error');
        })
    })
});