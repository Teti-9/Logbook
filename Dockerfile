FROM node:24-alpine

WORKDIR /app

COPY package*.json prisma.config.ts ./
COPY prisma ./prisma

RUN npm ci

COPY . .

RUN npx prisma generate

EXPOSE 8000

CMD ["sh", "-c", "npx prisma migrate deploy && node ./src/server.js"]
