FROM node:16

WORKDIR /usr/src/app/dist
COPY package*.json ./

ARG github_auth

RUN npm install .

COPY . .
EXPOSE 8080
ENV GITHUB_AUTH=${github_auth}

CMD ["npm", "run", "start-docker"]