import { IncomingMessage, ServerResponse, RequestOptions } from "http";
import { get, request } from 'https'
import { url } from "inspector";
import { GithubRepoResponse } from "../api/types";
import { updateHeadersAndSendResponseData } from "./route_utils";

/**
 * Post request to Github API with user provided Github Repo URL
 * @param req <IncomingMessage> request from client
 * @param res <ServerResponse> response server will send to client
 */
export function gitRepoPostRequest(req: IncomingMessage, res: ServerResponse): void {
    console.log(req)
    const testResponse: GithubRepoResponse = {
        id: 1,
        number: 100,
        title: 'test title',
        author: 'joe cool',
        commit_count: 1
    };
    updateHeadersAndSendResponseData(200, testResponse, res);
}

/**
 * Get request to Github API without any user input
 * @param req 
 * @param res 
 */
export function gitRepoGetRequest(req: IncomingMessage, res: ServerResponse): void {
    getGithubResponse('https://github.com/nodejs/docker-node').then((response: Array<any>) => {
        const openPullRequestList: Array<GithubRepoResponse> = []
        response.forEach(openPrObject => {
            openPullRequestList.push({
                id: openPrObject.id,
                number: openPrObject.number,
                title: openPrObject.title,
                author: openPrObject.user.login,
                commit_count: 0,
                commits_url: openPrObject.url
            });
        })
        return getNumberOfCommits(openPullRequestList, res)
    }).then((openPullRequestList: Array<GithubRepoResponse>) => updateHeadersAndSendResponseData(200, openPullRequestList, res)).catch((reason: Error) => {
        console.error(reason)
    });
    
}

/**
 * Function to sanitize any malformed url string entered by the user.
 * @param url user entered url
 * @returns valid url string
 */
function extractPathFromUrl(url: string): string | undefined {
    
    // check to make sure it is a valid github url
    if(url.includes('github.com')){
        // if valid split url into components
        const urlComponents = url.split('github.com/')
        // if not valid, return empty to
        return urlComponents[1]
    }

    return undefined;
}

/**
 * asynchronous function to get response from Github api
 * 
 * @param url sanitized repo url
 * @returns Github response object
 */
async function getGithubResponse(url: string): Promise<any> {
    const githubPromise: Promise<any> = new Promise((resolve, reject) => {
        const repoPath = extractPathFromUrl(url);
        if(!repoPath) {
            reject(new Error(`Invalid Github url- ${url}`));
        } else {
            const requestParams: RequestOptions = {
                hostname: 'api.github.com',
                path: `/repos/${repoPath}/pulls`,
                method: 'GET',
                headers: {
                    "User-Agent": 'rub1sco-GitHubApi',
                    "Accept": "application/vnd.github+json",
                    "Authorization": `Bearer ${process.env.GITHUB_AUTH}`
                }
            }

            let responseBody = ''
            const req = request(requestParams, (res: IncomingMessage) => {
                res.setEncoding('utf-8')
                res.on('data', (chunk: any) => {
                    responseBody += chunk;
                });
                res.on('end', () => {
                    resolve(JSON.parse(responseBody))
                });
                res.on('error', (error: Error) => {
                    console.error('an error occured receving data from Github')
                });
            });

            req.on('error', (error: Error) => console.error('An error occured with the request.'))
            req.end();
            
        }
    })

    return githubPromise;
}

function getNumberOfCommits(data: Array<GithubRepoResponse>, res: ServerResponse): Promise<any> {
    let promises: Array<Promise<any>> = []
    const reqOptions: RequestOptions = {
        hostname: 'api.github.com',
        path: '',
        method: 'GET',
        headers: {
            "User-Agent": 'rub1sco-GitHubApi',
            "Accept": "application/vnd.github+json",
            "Authorization": `Bearer ${process.env.GITHUB_AUTH}`
        },
    }

    data.forEach((repo) => {
        const promise = new Promise((resolve, reject) => {
            if (repo.commits_url) {
                const repoPath = extractPathFromUrl(repo.commits_url);
                reqOptions.path = `/${repoPath}`;

            }
            let body = ''
            request(reqOptions, (res: IncomingMessage) => {
                res.on('data', (chunk) => body += chunk);
                res.on('error', (error) => reject(error));
                res.on('end', () => {
                    const commitsObj = JSON.parse(body);
                    repo.commit_count = commitsObj.commits;
                    delete repo.commits_url;
                    resolve(repo)
                })
            }).end();
        });
        promises.push(promise);
    })

    return Promise.all((promises));

}