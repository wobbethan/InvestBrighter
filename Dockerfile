FROM node:lts-alpine as builder

ENV NODE_ENV production
COPY ./frontend/package*.json ./
RUN npm ci --omit=dev --legacy-peer-deps

COPY ./frontend/public ./public
COPY ./frontend/src ./src
COPY ./frontend/tailwind.config.js ./

RUN npm run build

# build and run server
FROM node:lts-alpine

ENV NODE_ENV production
RUN mkdir -p frontend
COPY --from=builder ./build ./frontend/build

COPY ./package*.json ./
RUN npm ci --omit=dev --legacy-peer-deps

COPY ./backend ./backend

USER node
EXPOSE 8000
CMD ["node", "backend/server.js"]