# Base Stage
FROM node:22-alpine AS base

WORKDIR /app

COPY ./package*.json ./

RUN npm install

# Production Builder Stage
FROM base AS builder

ARG VITE_API_BASE_URL_PROD
ARG VITE_API_BASE_URL_LOCAL

ENV VITE_API_BASE_URL_PROD=$VITE_API_BASE_URL_PROD
ENV VITE_API_BASE_URL_LOCAL=$VITE_API_BASE_URL_LOCAL

COPY . . 

RUN npm run build

# Production Stage
FROM nginx:stable-alpine AS prod

COPY --from=builder /app/dist /usr/share/nginx/html
COPY /nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]