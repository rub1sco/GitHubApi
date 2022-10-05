export interface GithubRepoResponse {
    id: number;
    number: number;
    title: string;
    author: string;
    commit_count: number;
}

export interface ErrorResponse {
    error: string;
}