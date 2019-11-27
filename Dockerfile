FROM node:8.10.0

RUN apt-get update
RUN apt-get install sqlite

COPY . /app
WORKDIR /app

RUN npm install

EXPOSE 8080 8081 8082

CMD ["npm","start"]
