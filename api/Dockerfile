FROM node:current-slim

ENV NODE_ENV=production

WORKDIR /

COPY ["package.json", "yarn.lock", "./"]

EXPOSE 9002

RUN yarn

COPY . .

CMD [ "yarn", "start" ]

