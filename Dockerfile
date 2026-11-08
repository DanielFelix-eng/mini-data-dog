FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm --prefix client install
RUN npm --prefix client run build

EXPOSE 3000

CMD ["npm", "start"]
