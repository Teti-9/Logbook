FROM node:24-alpine

WORKDIR /app

COPY package*.json prisma.config.ts ./
COPY prisma ./prisma

RUN npm ci

COPY . .

RUN npx prisma generate

RUN npm install -g nodemon

EXPOSE 8000