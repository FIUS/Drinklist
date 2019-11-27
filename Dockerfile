FROM node:8.16-buster

RUN sudo apt-get -y update
#RUN sudo apt-get -y upgrade
RUN sudo apt-get install -y sqlite3 libsqlite3-dev

COPY . /app
WORKDIR /app

RUN npm install

EXPOSE 8080 8081 8082

CMD ["npm","start"]
