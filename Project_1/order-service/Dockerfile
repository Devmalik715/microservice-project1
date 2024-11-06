# order-service/Dockerfile
FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 6000
CMD ["node", "app.js"]
