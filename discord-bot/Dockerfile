FROM node:18-alpine

WORKDIR /app

COPY discord-bot/package.json ./

RUN npm install

COPY discord-bot/src ./src

CMD ["node", "src/index.js"]
