# GraphQL Auth

Testing GraphQL Authentication and Authorization

## Running

```bash
# Copy and fill .env file with environment data
cp .env .env.dist

# Local - development mode
yarn run dev

# Local - production mode
yarn run start

# Docker - development mode
cp docker-compose.development.yml docker-compose.override.yml
docker-compose up --build -d
```

## Deployment

```bash
# Docker - production mode
docker-compose -f docker-compose.yml build
```
