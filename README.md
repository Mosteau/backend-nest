<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

Task management backend API built with NestJS and MongoDB.

## Features

- Task CRUD operations (create, read, update, delete)
- MongoDB integration with Mongoose ODM
- Input validation with class-validator
- Automatic timestamps (createdAt, updatedAt)
- Docker containerization

## Prerequisites

### Option 1: With Docker (Recommended)

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
  - Windows: Docker Desktop for Windows
  - Linux: Docker Engine + Docker Compose
  - macOS: Docker Desktop for Mac

### Option 2: Without Docker

- [Node.js](https://nodejs.org/) 20.x or higher
- [pnpm](https://pnpm.io/) package manager
- [MongoDB](https://www.mongodb.com/try/download/community) 7.x running locally

## Installation

### With Docker (Recommended)

1. Clone the repository
```bash
git clone <repository-url>
cd backend-nest
```

2. Make sure Docker Desktop is running

3. Start the application
```bash
docker-compose up -d
```

The application will be available at `http://localhost:3000`

MongoDB will be available at `mongodb://localhost:27017`

**Useful Docker commands:**
```bash
# View logs
docker-compose logs -f

# View app logs only
docker-compose logs -f app

# Stop the application
docker-compose down

# Rebuild and restart
docker-compose up -d --build

# Remove volumes (clean database)
docker-compose down -v
```

### Without Docker

1. Install dependencies
```bash
pnpm install
```

2. Make sure MongoDB is running locally on port 27017

3. (Optional) Set environment variables
```bash
# Create .env file
PORT=3000
MONGO_URI=mongodb://localhost:27017/dbtest
```

4. Start the application
```bash
# Development mode with hot reload
pnpm run start:dev

# Production mode
pnpm run build
pnpm run start:prod
```

## API Endpoints

### Tasks

- `GET /tasks` - Get all tasks
- `GET /tasks/:id` - Get a task by ID
- `POST /tasks` - Create a new task
  ```json
  {
    "title": "Task title",
    "description": "Task description"
  }
  ```
- `PATCH /tasks/:id` - Update a task
  ```json
  {
    "title": "Updated title",
    "description": "Updated description",
    "completed": true
  }
  ```
- `DELETE /tasks/:id` - Delete a task

## Testing

```bash
# Unit tests
pnpm run test

# Watch mode
pnpm run test:watch

# Test coverage
pnpm run test:cov

# E2E tests
pnpm run test:e2e
```

## Code Quality

```bash
# Lint and auto-fix
pnpm run lint

# Format code
pnpm run format
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |
| `MONGO_URI` | `mongodb://localhost:27017/dbtest` | MongoDB connection string |

## Tech Stack

- NestJS 11
- TypeScript 5.7
- MongoDB 7
- Mongoose 9
- Docker & Docker Compose
- class-validator & class-transformer
- Jest for testing



## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).


## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
