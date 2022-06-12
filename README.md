# envo

## Prerequisites

- Node 16+
- Yarn
- Docker + Docker Compose

## Workspaces scripts

- `yarn build` - Build all workspaces
- `yarn test` - Run unit/integration tests in all workspaces
- `yarn dev` - Start the project (API servers, DBs, proxies, etc) in development inside Docker VM
- `yarn dev:local` - Start workspaces (API servers, etc) in development, locally without Docker

## Useful Docker commands:

- `docker compose -f ./docker-compose.dev.yml up admin-db` - Start only `admin-db` Docker service for development 
- `docker compose -f ./docker-compose.dev.yml run -i --rm <service> /bin/sh` - Run interactive shell in Docker `<service>`

## Prisma:

Admin API service (`service/admin/api`) uses Prisma to manage the data.

To create a new migration in development follow these steps:

1. Start `admin-db` Docker service: `docker compose -f ./docker-compose.dev.yml up admin-db`
2. Run Prisma CLI: `yarn workspace admin-api run prisma migrate dev`
