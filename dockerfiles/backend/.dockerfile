FROM node:24.10.0-alpine

WORKDIR /app

RUN npm install pm2 -g

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["pm2-runtime", "dist/main.js", "--name", "nestjs-app", "-i", "max"]
