# build commands
FROM node:18

WORKDIR /app
COPY package*.json .

COPY . .

RUN npm ci --only=production