FROM node:boron

ENV NODE_ENV development
ENV PORT 3000
ENV LOG_LEVEL debug

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app

EXPOSE 3000

CMD [ "npm", "start" ]
