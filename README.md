# juntbox

## Localdev setup

First, copy `.env.example` into a new file `.env` at the project root directory.
Follow the instructions in the file for generating a new AUTH_SECRET.

**Database:** local development uses **native PostgreSQL** on your machine (Debian/Ubuntu
or WSL with `postgresql-common`). Install a server package such as `postgresql-17`, set
the `LOCAL_PG_*` variables and matching `DATABASE_URL` / `DIRECT_URL` in `.env`, then run
`./setup.sh` (see `.env.example`).

Run `./setup.sh` from anywhere; it loads `.env` from the repo root. The script will:

- Optionally provision a local PostgreSQL cluster (only if `LOCAL_PG_CLUSTER_NAME` is set in `.env`; on WSL, if `systemctl` start fails, the script retries with `pg_ctl` and prints log/journal commands)
- Install nvm and then Node at the `NODE_VERSION` from `.env`
- Install Yarn and run `yarn` in the project root to install packages

## Running the app in localdev

Before running the app, run `yarn db:migrate` to migrate your local database and
`yarn db:generate` to generate the prisma client. Do these after any changes to
the database schema.

Run `yarn dev` to run the web app. If you change any dependencies in package.json,
rerun `yarn` and then start the app over again with `yarn dev`.

If you make updates to the database schema in `prisma/schema.prisma`, run
`yarn db:makemigrations` to create the migration files.

You can launch a visual editor for the database in the browser with `yarn db:studio`.

To make a sysadmin user, run `yarn makesysadmin`. This can also be done in dev
and prod via the shell where they are deployed.

## Building and running on dev and prod

In nonlocal environments (dev and prod), we need to run the production version
of nextjs to serve up the web app. The build script should be
`yarn db:migrate && yarn db:generate && yarn build`. Then the launch script should
be `yarn start`.
