FROM node:16

COPY . /app
WORKDIR /app

RUN apt update
RUN apt install sqlite3

RUN npm install
RUN npm run build
EXPOSE 8080

CMD node dist/express/main.js
