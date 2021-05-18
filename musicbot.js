//const Discord = require('discord.js');
//const { prefix, token,} = require('./config.json');
//const ytdl = require('ytdl-core');

//conts client = new Discord.Client();

//const queue = new Map();

//client.login(token);

//client.on('message', asynd message -> {

//})

client.on("message", async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const serverQueue = queue.get(message.guild.id);

  if (message.content.startsWith(`${prefix}play`)) {
    execute(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}skip`)) {
    skip(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}stop`)) {
    stop(message, serverQueue);
    return;
  } else {
    message.channel.send("You need to enter a valid command!");
  }
});

