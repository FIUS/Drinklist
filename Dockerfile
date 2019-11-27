FROM node:8.16-buster

COPY . /app
WORKDIR /app

RUN npm install

EXPOSE 8080 8081 8082

CMD ["npm","start"]
