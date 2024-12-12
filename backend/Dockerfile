FROM node:18-alpine

WORKDIR /app
COPY ./backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install
COPY ./backend ./
RUN npm run build

EXPOSE 4000
CMD ["npm", "start"]