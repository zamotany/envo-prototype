# envo

This project is a prototype of a remote configuration solution, mainly developed for personal growth.

It allows to manage projects, their environments, configs, publish drafts and revert live configs.

## Prerequisites

- Node 16+
- Yarn
- Docker + Docker Compose

## Common workspaces scripts

- `yarn build` - Build all workspaces
- `yarn test` - Run unit/integration tests in all workspaces

## Development

Regular development uses services (apis and apps) running locally, without any proxy:

- `yarn dev:admin-api`
- `yarn dev:admin-app`

When developing `admin-api` (`services/admin/api`) it's required to run `admin-db` database first:

```bash
yarn docker:base
```

This script will run PostgreSQL and `pgadmin` using `docker/compose.base.yml` Docker compose and expose:

- `localhost:5432` - for PostgreSQL (`admin-db` service)
- `localhost:9000` - for `pgadmin`

### Prisma:

`admin-api` service (`service/admin/api`) uses Prisma to manage the data.

To create a new migration in development follow these steps:

1. Start `admin-db` Docker service: `yarn docker:base`
2. Run Prisma CLI: `yarn workspace admin-api run prisma migrate dev`

### Debugging

#### `admin-api`

`yarn dev:admin-api` script be default opens up inspector, so to debug `admin-api` service, simply attach inspector (VSCode debugger/Chrome Node inspector) to the running process. 

#### Docker containers

For debugging running Docker containers, use `docker compose -f ./docker-compose.dev.yml run -i --rm <service> /bin/sh` where `<service>` is the name of the service to debug.


## Testing

To test the project in E2E fashion, run `yarn docker:test` which will use both `docker/compose.base.yml` and `docker/compose.test.yml` to run all services, apis and app behind a Nginx as a proxy using self-signed SSL certificate.

One the services are running open `https://localhost:4443/admin` for Admin app or `https://localhost:4443/api/admin` for Admin API.


