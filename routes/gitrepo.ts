import { IncomingMessage, ServerResponse, RequestOptions } from "http";
import { request } from 'https'
import { GithubRepoResponse, PostBody } from "../api/types";
import { updateHeadersAndSendResponseData } from "./route_utils";

/**
 * Post request to Github API with user provided Github Repo URL
 * @param req <IncomingMessage> request from client
 * @param res <ServerResponse> response server will send to client
 */
export function gitRepoPostRequest(req: IncomingMessage, res: ServerResponse): void {
    let body: string  = ''
    req.on('readable', () => {
        const response = req.read()
        if(response !== null){
            body += response;
        }
    });
    req.on('end',() => {
        const gitHubUrlFromUser = JSON.parse(body);
        getGithubResponse(gitHubUrlFromUser.url).then((response: Array<any>) => {
            if(response.length){
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
            } 
            return updateHeadersAndSendResponseData(400, response, res);
        }).then((openPullRequestList: Array<GithubRepoResponse>) => updateHeadersAndSendResponseData(200, openPullRequestList, res)).catch((reason: Error) => {
            console.error(reason);
            updateHeadersAndSendResponseData(400, {error: reason.message}, res);
        });
        
    })
}

/**
 * Get request to Github API without any user input
 * @param req 
 * @param res 
 */
export function gitRepoGetRequest(req: IncomingMessage, res: ServerResponse): void {
    getGithubResponse('https://github.com/nodejs/docker-node').then((response: Array<any>) => {
        const openPullRequestList: Array<GithubRepoResponse> = []
        if(response.length) {
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
        }
        // return response;
    }).then((openPullRequestList: Array<GithubRepoResponse>) => updateHeadersAndSendResponseData(200, openPullRequestList, res)).catch((reason: Error) => {
        console.error(reason)
    });
    
}

/**
 * Function to extract the path from the user provided github URL.
 * Requirements:
 * 1. url MUST contain 'github.com' or else it will be invalid.
 * 2. will remove ending '/' to be consistent between multiple calls.
 * 3. if user has accidentally entered a space in path, will automatically remove 
 * 4. if path is malformed, will attempt to correct path.
 * 
 * @param url user entered url
 * @returns valid Path
 */
function extractPathFromUrl(url: string): string | undefined {
    if(url.includes('github.com')){
        const urlComponents = url.split('github.com/')

        if(urlComponents[1].endsWith('/')) {
            urlComponents[1] = urlComponents[1].substring(0, urlComponents[1].length - 1);
        }
        if(urlComponents[1].includes(' ')) {
            urlComponents[1] = urlComponents[1].replace(' ', '');
        }
        if(urlComponents[1].includes('//')){
            urlComponents[1] = urlComponents[1].replace('//', '/');
        }

        return urlComponents[1].includes('repos/') ? urlComponents[1] : `repos/${urlComponents[1]}`
    }

    return undefined;
}

/**
 * asynchronous function to get response from Github api.
 * 
 * @param url sanitized repo url
 * @returns Github response object
 */
function getGithubResponse(url: string): Promise<any> {
    const githubPromise: Promise<any> = new Promise((resolve, reject) => {
        const repoPath = extractPathFromUrl(url);
        
        if(!repoPath) {
            reject(new Error(`Invalid Github url- ${url}`));
        } else {
            const requestParams: RequestOptions = {
                hostname: 'api.github.com',
                path: `/${repoPath}/pulls`,
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
                    reject(new Error('an error occured getting a response from Github.'))
                });
            });

            req.on('error', (error: Error) => console.error('An error occured with the request.'))
            req.end();
            
        }
    })

    return githubPromise;
}

/**
 * retrieves the number of commits that were related to the PR. data contains the link to the current PR url and will fetch
 * the request from github and promise will be pending in promises array. multiple promises will be returned with Promise.all()
 * 
 * @param data data array containing github repo information
 * @param res Server response object to send back to client
 * @returns All promises that are still pending
 */
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