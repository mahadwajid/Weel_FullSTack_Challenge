FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
CMD ["sh", "-c", "node src/scripts/wait-for-db.cjs && npm run setup && npm run dev"]
