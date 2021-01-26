FROM node:14.15-alpine3.11

RUN apk add --no-cache sqlite tzdata

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build-angular

EXPOSE 8080 8081

CMD ["npm", "run", "start-prod"]
