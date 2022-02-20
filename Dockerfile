# syntax=docker/dockerfile:1.3

FROM node:16-alpine

RUN apk add --no-cache sqlite tzdata

WORKDIR /app

# Install NPM dependencies
RUN --mount=source=package.json,target=package.json --mount=source=package-lock.json,target=package-lock.json \
    apk add --no-cache --virtual .gyp python3 make g++ && \
    ln -s $(which python3) /usr/bin/python && \
    npm ci && \
    rm /usr/bin/python && \
    apk del .gyp

COPY sql sql/
COPY dist dist/

EXPOSE 8080

CMD node dist/express/main.js
