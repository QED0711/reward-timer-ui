from node:18-buster
ENV TZ="America/New_York"

RUN apt-get update; apt-get install -y \
    vim

WORKDIR /app

COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json
RUN npm install

WORKDIR /app/server
COPY ./server/package.json /app/server/package.json
COPY ./server/package-lock.json /app/server/package-lock.json
RUN npm install

WORKDIR /app

COPY . /app
RUN mv /app/src/config/config.deploy.js /app/src/config/config.js

RUN npm run build

WORKDIR /app/server

CMD ["npm", "run", "start_prod"]
