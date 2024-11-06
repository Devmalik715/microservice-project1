# user-service/Dockerfile
# user-service/Dockerfile
FROM node:16 
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 4000
CMD ["node", "app.js"]


