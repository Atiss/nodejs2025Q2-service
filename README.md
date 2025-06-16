# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.
- Docker - [Download & Install Docker](https://www.docker.com/products/docker-desktop)
- Docker Compose - [Download & Install Docker Compose](https://docs.docker.com/compose/install/)

## Running the application locally with Docker
```
docker-compose up --build -d
```
Image of the application is stored in the Docker Hub repository: [atiss/nodejs2025Q2-service](https://hub.docker.com/r/atiss/nodejs2025q2-service).

## Running the application locally with Docker in development mode
```
docker-compose -f docker-compose-dev.yml up --build -d
```

# Running the application locally without Docker
## Downloading

```
git clone git@github.com:Atiss/nodejs2025Q2-service.git
```

## Installing NPM modules

```
npm install
```

## Environment variables
create or copy a `.env` file in the root directory of the project from the template `.env.example`.

## Running application

```
npm start
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Scan for vulnerabilities

```
npm run scan:vulnerabilities
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
