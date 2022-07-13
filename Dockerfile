FROM node:16
COPY . /app
WORKDIR /app

RUN apt update
RUN apt upgrade -y
RUN apt install sqlite3

RUN npm install
RUN npm run build

EXPOSE 8080

CMD ["npm", "run", "start-prod"]

