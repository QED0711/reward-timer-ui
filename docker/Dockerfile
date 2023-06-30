from node:18-buster

RUN apt-get update; apt-get install -y \
    vim

WORKDIR /app
COPY . /app

RUN npm install
RUN npm run build
WORKDIR /app/server
RUN npm install 

CMD ["npm", "start"]
