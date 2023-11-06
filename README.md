# Watchmode and ChatGPT

In order to start `Postgres`, use the `docker-compose` command:

```sh
docker-compose up
```

## Run the backend

Install dependencies

```sh
yarn
```

If you want to run the service during development, you can use the quite standard ways:

```sh
yarn start:dev
```

## Endpoints

- /movie/search GET
  - API endpoint that allows searching for a movie or an actor
  - http://localhost:6060/api/v1/movie/search?search=Interstellar&type=movie
  - search must be uriEncoded like here: Ed%20Wood
- /movie/description POST
  - generate a short description of the movie with OpenAI's API and save to postgress db as Description
  - http://localhost:6060/api/v1/movie/description?search=Inception&type=movie
- /movie/descriptions GET
  - API endpoint that allows listing movies by their title and production date (year)
  - http://localhost:6060/api/v1/movie/descriptions?year=2014&title=inter
