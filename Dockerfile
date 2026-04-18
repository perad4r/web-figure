FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . ./

RUN npm run favicons
RUN npm run build:css

FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY . ./
COPY --from=build /app/public/favicons /app/public/favicons
COPY --from=build /app/public/assets/css/tailwind.css /app/public/assets/css/tailwind.css

EXPOSE 3000

RUN chmod +x /app/docker-entrypoint.sh

ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["node", "src/server.js"]
