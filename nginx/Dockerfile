FROM node:latest as build

WORKDIR /app

COPY frontend/package.json frontend/yarn.lock ./

RUN yarn install --production --frozen-lockfile --network-timeout 100000

ENV PATH="./node_modules/.bin:$PATH"

COPY frontend ./
RUN yarn build

FROM nginx:1.17.4-alpine

COPY --from=build /app/build /home/app/frontend
EXPOSE 80

RUN rm /etc/nginx/conf.d/default.conf
RUN rm /etc/nginx/nginx.conf
COPY nginx/default.conf /etc/nginx/conf.d
COPY nginx/nginx.conf /etc/nginx
