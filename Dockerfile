FROM node:14

WORKDIR /var/www/app

COPY . .

RUN npm install
