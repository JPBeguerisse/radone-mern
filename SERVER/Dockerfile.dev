#Dockerfile server
FROM node:18-alpine

RUN apk add --no-cache make g++ python3


WORKDIR '/app'

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8000

CMD ["npm", "run", "dev"]
