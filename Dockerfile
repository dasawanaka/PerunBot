FROM node:12

ENV config="config.json"

RUN apt-get update || : && apt-get install python -y

WORKDIR /app

COPY . /app

RUN npm install

RUN npm install -g node-gyp

CMD ["sh", "-c", "node bot.js --config=${config} --dev" ]