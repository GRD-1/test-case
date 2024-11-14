# Backend developer test task

<br>
<p style="display: block; width: 100%; text-align:left;">
  <a href="https://nodejs.org/en/about" target="_blank"><img src="https://img.shields.io/badge/Node.js-v20.14.0-blue?logo=nodedotjs" alt="Node.js Version" /></a>
  <a href="https://www.typescriptlang.org/" target="_blank"><img src="https://img.shields.io/badge/TypeScript-v5.3.2-blue?logo=typescript" alt="TypeScript Version" /></a>
  <a href="https://nestjs.com/" target="_blank"><img src="https://img.shields.io/badge/Nest.js-v9.4.2-blue?logo=nestjs" alt="Nest.js Version" /></a>
  <a href="" target="_blank"><img src="https://img.shields.io/badge/covarage-34%25-%2300c642?style=flat" alt="Coverage" /></a>
  <a href="" rel="nofollow"><img src="https://img.shields.io/badge/istall_size-115KB-%23ebdb32?style=flat" alt="install size"></a>
</p>

## Contents

1. [Stack](#stack)
2. [Launch](#launch)
3. [Tests](#tests)
4. [Data storage](#data-storage)
5. [Documentation](#documentation)

## Stack

<div>
    <div>
          <div style="display: flex; flex-wrap: wrap; height: 300px;">
            <div style="width: 40%; height: fit-content;"><a href="https://ubuntu.com/" target="_blank"><img src="https://img.shields.io/badge/Linux_Ubuntu-v22.04-blue?style=for-the-badge&logo=ubuntu" alt="Linux Ubuntu Version" /></a></div>
            <div style="width: 40%; height: fit-content;"><a href="https://www.docker.com/products/docker-desktop/" target="_blank"><img src="https://img.shields.io/badge/docker-v24.0.2-blue?style=for-the-badge&logo=docker" alt="Docker Version" /></a></div>
            <div style="width: 40%; height: fit-content;"><a href="https://nodejs.org/en/about" target="_blank"><img src="https://img.shields.io/badge/Node.js-v20.14.0-blue?style=for-the-badge&logo=nodedotjs" alt="Node.js Version" /></a></div>
            <div style="width: 40%; height: fit-content;"><a href="https://nestjs.com/" target="_blank"><img src="https://img.shields.io/badge/Nest.js-v9.4.2-blue?style=for-the-badge&logo=nestjs" alt="Nest.js Version" /></a></div>
            <div style="width: 40%; height: fit-content;"><a href="https://www.typescriptlang.org/" target="_blank"><img src="https://img.shields.io/badge/TypeScript-v5.3.2-blue?style=for-the-badge&logo=typescript" alt="TypeScript Version" /></a></div>
            <div style="width: 40%; height: fit-content;"><a href="https://redis.io/" target="_blank"><img src="https://img.shields.io/badge/Redis-v7.2.4-blue?style=for-the-badge&logo=redis" alt="Redis Version" /></a></div>
            <div style="width: 40%; height: fit-content;"><a href="https://www.postgresql.org/" target="_blank"><img src="https://img.shields.io/badge/postgresql-v16.0.0-blue?style=for-the-badge&logo=postgresql&logoColor=%2313BEF9" alt="Postgres Version" /></a></div>
            <div style="width: 40%; height: fit-content;"><a href="https://www.prisma.io/docs" target="_blank"><img src="https://img.shields.io/badge/Prisma_ORM-v5.15.0-blue?style=for-the-badge&logo=prisma" alt="Prisma Version" /></a></div>
            <div style="width: 40%; height: fit-content;"><a href="https://jestjs.io/" target="_blank"><img src="https://img.shields.io/badge/Jest-v29.0.5-blue?style=for-the-badge&logo=jest" alt="Jest Version" /></a></div>
            <div style="width: 40%; height: fit-content;"><a href="https://github.com/typicode/husky" target="_blank"><img src="https://img.shields.io/badge/husky-v8.0.3-blue?style=for-the-badge" alt="Husky Version" /></a></div>
          </div>
    </div>
</div>

## Launch

1. Install <a href="https://nodejs.org/en" target="_blank">Node</a> Node >=20.14.0
2. Install <a href="https://www.docker.com/products/docker-desktop/" target="_blank">Docker</a> and <a href="https://docs.docker.com/compose/" target="_blank">Docker-compose</a>
3. Install dependencies:
``` bash
$ npm i
```
4. Copy environment variables from the sample:
``` bash
$ cp .env.sample .env
```
5. Create RSA keys:
``` bash
$ npm run generate-keys
```
6. Run docker:
``` bash
$ docker compose -f ./docker/docker-compose.yml --env-file .env up -d
```
7. Update database schema:
``` bash
$ npm run migration:up
```
8. Run the application using package.json scripts, e.g:
``` bash
$ npm run start:dev
```
## Tests

* Run the specific test set using package.json scripts, or all the tests at once, e.g:
``` bash
$ npm run test
```

## Data storage

* IMDB: <a href="https://redis.io/" target="_blank">Redis</a> v7.2.4
* DBMS: <a href="https://www.postgresql.org/" target="_blank">PostgreSQL</a> v16.0.0
* ORM: <a href="https://www.prisma.io/" target="_blank">Prisma</a> v5.15.0
    * schema is here: [./prisma/migrations](prisma/schema.prisma)
    * migrations are here: [./prisma/migrations](prisma/migrations)
    * prisma repositories are here: [./src/modules/prisma/repositories](src/modules/prisma/repositories)
    * To update the schema use the scripts like ""prisma:*" from [package.json](package.json)
    * To work with migrations use the scripts like "migration:*" from [package.json](package.json)

## Documentation
### Swagger API map
* The current API map is [here](public/OpenApi.json)
* In a development mode you can access the current API map using the endpoint https://localhost:3000/api
* To get the API json go to https://localhost:3000/api-json
* To switch the project to development mode, in [.env](.env) set NODE_ENV=development
