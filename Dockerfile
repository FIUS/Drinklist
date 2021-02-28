FROM node:14.15-alpine3.11

RUN apk add --no-cache sqlite tzdata

WORKDIR /app
COPY . .

# Install NPM dependencies with available C++ toolchain to build native add-ons
RUN apk add --no-cache --virtual .gyp python make g++
RUN npm install
# Remove toolchain as it is only required for depency install
RUN apk del .gyp

RUN npm run build

EXPOSE 8080

CMD ["npm", "run", "start-prod"]
