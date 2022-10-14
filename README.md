Project Requirements:
- Utilize NodeJS
- expose an endpoint that returns information by a user entered github repo. (use GithubAPI: https://developer.github.com/v3)
    - included info: ID, number, title, author, number of commits of each open pull request.
    - make requests via REST api to fetch necessary data
- for each open PR return: 
    - ID, number, title, Author, number of commits
- Implment testing strategy for unit, integration, and e2e tests
- simple, clean API meant for public consumption

How to use:
With node server running, clients can send POST requests to localhost:8080/git with a body message {url: githublink} to retrieve
a list of all open PRs with the ID, PR number, author, and number of commits. Currently a root request will respond to the client with {}.
This was done to support future development or to support a landing page for user information.

To run in a docker setup:
1. run `docker build -t github-api --build-arg github_auth=<GITHUB_API_KEY> .`
2. run `docker run -dp 8080:8080 github-api`
3. container should now be started and running on localhost:8080

to run a production build:
1. run `npm run build` to compile typescript into javascript
2. run `npm start`
3. server should now be running on port 8080 (or whatever you define $PORT to be in env variables)

To run in development:
1. run `npm run start-dev` 
2. server should now be running

Ways to improve / additions:
- Added support for Docker containers. As a microservice, this service can be connected to other microservices (ie. db container, front end container, etc) and hosted on cluster or AWS Lambda. Running in a cluster, we can scale with multiple instances of the container service if needed.

- Added eslint to reinforce code structure

- To improve, it would be great to support all events for node functions in order to support anything that could cause an error

- To improve, it would be beneficial to test against DDOS attacks

- To improve, testing the scalability of the server to ensure it can handle tons of requests from clients