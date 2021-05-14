FROM node:12

RUN apt-get update || : && apt-get install python -y

WORKDIR /app

COPY . /app

RUN npm install

RUN npm install -g node-gyp

CMD ["node", "bot.js"]