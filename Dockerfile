# syntax=docker/dockerfile:1.3

FROM node:16-alpine AS base

RUN apk add --no-cache sqlite tzdata

FROM base AS deps

WORKDIR /build

RUN apk add --no-cache --virtual .gyp python3 make g++
RUN ln -s $(which python3) /usr/bin/python

# Install NPM dependencies
RUN --mount=source=package.json,target=package.json --mount=source=package-lock.json,target=package-lock.json \
    npm ci

FROM base AS final

WORKDIR /app

COPY --from=deps /build/node_modules node_modules/
COPY sql sql/
COPY dist dist/

EXPOSE 8080

CMD node dist/express/main.js

