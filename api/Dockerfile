FROM node:current-slim

WORKDIR /usr/src/app
COPY package.json .
RUN yarn

EXPOSE 8080
CMD [ "yarn", "start" ]

COPY . .
