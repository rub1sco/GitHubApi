import {
    describe,
    it,
    expect,
    jest
} from '@jest/globals'
import {
    MockRequestOptions,
    Request,
    Response
} from 'mock-http';
import { invalidRequest, rootGetRequest } from '../../routes/misc_routes';

describe('misc_routes tests', () => {
    it('should get root get request', () => {
        const req = new Request({
            url: '/',
            method: 'GET'
        } as MockRequestOptions)
        const res = new Response({

        } as MockRequestOptions);
        expect(res.statusCode).toBeFalsy()
        rootGetRequest(req, res);
        expect(res.statusCode).toBe(200);
    });

    it('should send invalid page response', () => {
        const req = new Request({
            url: '/',
            method: 'GET'
        } as MockRequestOptions)
        const res = new Response({

        } as MockRequestOptions);
        expect(res.statusCode).toBeFalsy()
        invalidRequest(req, res);
        expect(res.statusCode).toBe(404);
    });
})