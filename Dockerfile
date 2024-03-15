FROM node:lts-slim as base

WORKDIR /home/node/app

COPY . .

RUN yarn
RUN yarn build

ENV NODE_ENV=local
ENV PORT=3000

EXPOSE ${PORT}

ENTRYPOINT ["yarn", "start:prod"]