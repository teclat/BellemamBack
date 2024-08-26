FROM node:18.10.0-alpine AS builder

ENV TZ "America/Sao_Paulo"
RUN apk update && apk add tzdata

WORKDIR /usr/src/app

COPY ./package.json /usr/src/app/package.json
COPY . /usr/src/app

RUN yarn install

EXPOSE 8080

CMD ["yarn", "start"]