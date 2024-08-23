FROM node:18.10.0-alpine AS builder

ENV TZ "America/Sao_Paulo"
RUN apk update && apk add tzdata

WORKDIR /usr/src/app
COPY . /usr/src/app

COPY ./package.json /usr/src/app/package.json

RUN yarn install

EXPOSE 80

CMD ["yarn", "start"]