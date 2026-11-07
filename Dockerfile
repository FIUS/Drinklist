FROM node:16
COPY . /app
WORKDIR /app

RUN apt update
RUN apt upgrade -y
RUN apt install -y sqlite3 texlive-latex-base texlive-latex-recommended texlive-fonts-recommended

RUN npm install
RUN npm run build

EXPOSE 8080

CMD ["npm", "run", "start-prod"]

