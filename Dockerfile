FROM node:16-alpine 

WORKDIR /usr/src/app

COPY package.json yarn.lock ./ 
RUN yarn install

COPY . . 

RUN yarn build

EXPOSE 3008
CMD ["yarn", "start"]