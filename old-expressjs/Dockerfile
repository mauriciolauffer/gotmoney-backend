FROM node:10-alpine

ENV NODE_ENV development
ENV PORT 8080
ENV LOG_LEVEL verbose

# Create app directory
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app

# Install app dependencies
COPY package*.json ./
USER node
RUN npm install

# Bundle app source
COPY --chown=node:node . .

# Start app
EXPOSE 8080
CMD [ "node", "lib/server.js" ]
