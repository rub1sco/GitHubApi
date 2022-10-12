import { 
    gitRepoPostRequest,
    extractPathFromUrl, 
    getGithubResponse, 
    getNumberOfCommits } from "../../routes/gitrepo";
import { describe, it, expect, jest, test, beforeEach, afterEach } from '@jest/globals'
import { Request, Response, MockResponseOptions, MockResponseData, MockRequestOptions} from 'mock-http';
import * as moduleApi from '../../routes/route_utils'
import * as gitApi from '../../routes/gitrepo'
import { GithubRepoResponse } from "../../api/types";

require('dotenv').config()

describe('github api tests', () => {
    describe('POST functions', () => {
        it('gitRepoPostRequest with valid URL in body', () => {
            const validGitHubRepoLink = 'https://github.com/nodejs/node';
            const req: Request= new Request({
                method: 'POST',
                url: '/git',
                buffer: Buffer.from(JSON.stringify({ url: validGitHubRepoLink }))
            });
            const res: Response = new Response({onEnd: () => 'complete'})
            const spy = jest.spyOn(req, 'on').mockImplementation((_event, _listener) => req);
            
            gitRepoPostRequest(req, res);
            expect(spy).toHaveBeenCalled()
        });

        it('gitRepoPostRequest with invalid URL in body', async () => {
            // const invalidGitHubRepoLink = 'https://facebook.com/nodejs/node';
            // const req: Request = new Request({
            //     method: 'POST',
            //     url: '/git',
            //     buffer: Buffer.from(JSON.stringify({ url: invalidGitHubRepoLink }))
            // });
            // const res: Response = new Response({})

            // const spy = jest.spyOn(res, 'end').mockImplementation((chunk) => new Response({onEnd: () => 'complete'}));
            // gitRepoPostRequest(req, res);

            // await expect(res.closed).toBeTruthy()
        });

        it('gitRepoPostRequest with no body in URL', () => {
            const validGitHubRepoLink = 'https://github.com/nodejs/node';
            const req: Request = new Request({
                method: 'POST',
                url: '/git',
                buffer: Buffer.from(JSON.stringify({ }))
            });
            const res: Response = new Response({ onEnd: () => 'complete' })
            const spy = jest.spyOn(req, 'on').mockImplementation((_event, _listener) => req);

            gitRepoPostRequest(req, res);
            expect(spy).toHaveBeenCalled()
        });
    });

    describe('GET functions', () => {
        it('getGitHubResponse with url', async () => {
            const validUrl = ' https://github.com/nodejs/node';
            await getGithubResponse(validUrl)
            .then((val) => {
                expect(val.length).toBeGreaterThan(0);
            })
        });

        it('getGitHubResponse without url', async () => {
            const invalidUrl = '';
            await getGithubResponse(invalidUrl).catch((errorObject) => {
                expect(errorObject.message).toBe('Invalid Github url- ')
            });
            
        });

        it('getNumberOfCommits with empty array', async () => {
            const res = new Response();
            await getNumberOfCommits([], res).then((responseObj) => {
                expect(responseObj.length).toBe(0);
            });
        });

        it('getNumberOfCommits with data object in array', async () => {
            const validUrl = "https://api.github.com/repos/nodejs/node/pulls/44923";
            const res = new Response();
            await getNumberOfCommits([{
                id: 0,
                number: 0,
                title: "module: migrate to script context based host defined options",
                author: "legendecas",
                commit_count: 0,
                commits_url: validUrl} as GithubRepoResponse], res).then((responseObj) => {
                    expect(responseObj[0].commit_count).toBeGreaterThanOrEqual(2);
                });
        });
    });

    describe('data processing functions', () => {
        it('extract path from valid URL', () => {
            const validGitHubRepoLink = 'https://github.com/nodejs/node';
            const githubPath = extractPathFromUrl(validGitHubRepoLink);
            expect(githubPath).toBe('repos/nodejs/node')
        });

        it('extract path that contains ending / or not', () => {
            const validGitHubRepoLink = 'https://github.com/nodejs/node/';
            const githubPath = extractPathFromUrl(validGitHubRepoLink);
            expect(githubPath).toBe('repos/nodejs/node')
        });
        it('extract path with space in address', () => {
            const validGitHubRepoLink = 'https://github.com/ nodejs/node';
            const githubPath = extractPathFromUrl(validGitHubRepoLink);
            expect(githubPath).toBe('repos/nodejs/node')
        });

        it('should handle \'//\' in url address', () => {
            const validGitHubRepoLink = 'https://github.com/ nodejs//node';
            const githubPath = extractPathFromUrl(validGitHubRepoLink);
            expect(githubPath).toBe('repos/nodejs/node')
        });

        it('should return undfined for non github address', () => {
            const validGitHubRepoLink = 'https://facebook.com/nodejs/node';
            const githubPath = extractPathFromUrl(validGitHubRepoLink);
            expect(githubPath).toBeFalsy()
        })
    })
});