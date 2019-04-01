# CRUD API Boilerplate
> A minimal boilerplate for getting up and running with CRUD API backed by ASM for configuration and a range of Database support. Optimized for serverless usage

## Features
* Full POST, PUT, PATCH, GET, DELETE endpoints pre-built - you just add the logic
* Batch GET endpoint built in
* DynamoDB integrated out the box
* Easily hot-swappable DBs
* Configuration held with ASM and cached for you
* Health check baked in
* Built with docker - ready for shipping to AWS or wherever you host your services
* Full test coverage with Jest
* Authentication handled with JWT's
* Monitoring using Graphite
* Swagger and Swagger UI endpoint for all documentation
* Bunyan logging with cooralation identifiers for easy traceability
* Prebuilt handler file for Lambda usage
* Completely written in Typescript for quick development

## Get Setup
```bash
# Clone the repo
$ git clone https://github.com/cloudcalldev/asm-crud-boilerplate.git

# Download dependencies
$ npm i

# Remove the boilerplate git
$ rm -rf .git
$ git init
```

### Build with:
```bash
$ npm run build
```

### Run the dev environment with:
```bash
$ npm run start:dev
```

### Run tests with:
```bash
$ npm test
```

### Lint with:
```bash
$ npm run lint
```
