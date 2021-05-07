FROM node:12

RUN apt-get update || : && apt-get install python -y

WORKDIR /app

COPY . /app

RUN npm install

CMD ["node", "bot.js"]