export interface GithubRepoResponse {
    id: number;
    number: number;
    title: string;
    author: string;
    commit_count: number;
    commits_url?: string;
}

export interface ErrorResponse {
    error: string;
}