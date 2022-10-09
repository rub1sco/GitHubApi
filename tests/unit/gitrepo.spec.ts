const jest = require('@jest/globals')

jest.describe('github api tests', () => {
    jest.describe('POST functions', () =>{
        jest.it('gitRepoPostRequest with valid URL in body', () => {

        });

        jest.it('gitRepoPostRequest with invalid URL in body', () => {

        });

        jest.it('gitRepoPostRequest with no body in URL', () => {

        });
    });

    jest.describe('GET functions', () => {
        jest.it('gitRepoGetRequest with no parameters in address', () => {

        });

        jest.it('gitRepoGetRequest with parameters in address', () => {

        });

        jest.it('getGitHubResponse with url', () => {

        });

        jest.it('getGitHubResponse without url', () => {

        });

        jest.it('getNumberOfCommits with empty array', () => {

        });

        jest.it('getNumberOfCommits with data object in array', () => {

        });
    });

    jest.describe('data processing functions', () => {
        jest.it('extract path from valid URL', () => {
        });

        jest.it('extract path that contains ending / or not', () => {

        });
        jest.it('extract path with space in address', () => {

        });

        jest.it('should handle \'//\' in url address', () => {

        });
    })
});