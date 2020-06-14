FROM node:12-alpine
RUN npm i node-sass -D
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
ENTRYPOINT npm start