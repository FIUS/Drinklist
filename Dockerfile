FROM node:8.16-buster

RUN apt-get -y update
#RUN apt-get -y upgrade
RUN apt-get install -y sqlite3 libsqlite3-dev

COPY . /app
WORKDIR /app

RUN npm install

EXPOSE 8080 8081 8082

CMD ["npm", "run", "start-prod"]
