FROM node:8.4
ENV NODE_ENV production
ENV NPM_CONFIG_PRODUCTION false
WORKDIR /app
ADD . /app
RUN npm install
RUN npm run build:elm
RUN npm run build
RUN npm test
EXPOSE 5000
CMD npm start