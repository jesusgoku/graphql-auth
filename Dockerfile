FROM node:erbium-alpine as base

EXPOSE 4000
WORKDIR /src

COPY package.json yarn.lock ./
RUN yarn install


FROM base

COPY . .
CMD [ "yarn", "start" ]
