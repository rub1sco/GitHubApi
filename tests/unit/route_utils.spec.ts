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
import { updateHeadersAndSendResponseData } from '../../routes/route_utils';

describe('route utils tests', () => {
    it('should update headers and send 200 response with data', () => {
        const res = new Response({} as MockRequestOptions);
        expect(res.statusCode).toBeFalsy()
        updateHeadersAndSendResponseData(200, {}, res)
        expect(res.statusCode).toBe(200);
        console.log(res.getHeaders()['content-type'])
        expect(res.getHeaders()['content-type']).toBe('application/json');
    });

    it('should update headers and send 400 response with error data', () => {
        const res = new Response({} as MockRequestOptions);
        expect(res.statusCode).toBeFalsy()
        updateHeadersAndSendResponseData(400, {}, res)
        expect(res.statusCode).toBe(400);
        expect(res.getHeaders()['content-type']).toBe('application/json');
    });
})