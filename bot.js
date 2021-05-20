/* eslint-disable no-inline-comments */
/* eslint-disable indent */
const Discord = require("discord.js");
// eslint-disable-next-line no-unused-vars

//load config using param
const args = require('minimist')(process.argv.slice(2));
var configFileName;
if(args['config']===undefined){
  configFileName = 'config.json'
}else{
  configFileName = args['config']
}
console.log("Use config file: ", configFileName);

const { discord_conf } = require(`./${configFileName}`);
const client = new Discord.Client({
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
  disableEveryone: false,
});

const fs = require("fs");
const path = require("path");
const colors = require("colors");

const Guild = require("./models/guild");
const Distube = require(`distube`);
const status = (queue) =>
  `Filter: \`${queue.filter || "Off"}\` | Loop: \`${
    queue.repeatMode
      ? queue.repeatMode == 2
        ? "All Queue"
        : "This Song"
      : "Off"
  }\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;

client.mongoose = require("./utils/mongoose");
client.levels = require("./utils/levels");
client.rep = require("./utils/rep");
client.coins = require("./utils/coins");
client.distube = new Distube(client, {
  searchSongs: true,
  emitNewSongOnly: true,
});

const paths = {
  commands: path.join(__dirname, "commands"),
  events: path.join(__dirname, "events"),
};
const loader = {
  commands: require("./functions/loadCommands.js"),
  events: require("./functions/loadEvents.js"),
};

client.commands = new Discord.Collection();
client.events = new Discord.Collection();
client.guildSettings = new Discord.Collection();
client.tasks = new Discord.Collection();

loader.commands.load(paths.commands, client);
loader.events.load(paths.events, client);

client.once("ready", () => {
  console.log(colors.rainbow(`Ready! Bot started now!`));
});

client.on("guildCreate", (guild) => {
  console.log("Joined a new guild: " + guild.name);
});

client.on("message", async (message) => {
  client.events.get("newMessage").run(message, client);
});

client.on("messageDelete", async (message) => {
  await message.fetch();
  client.events.get("messageDelete").run(message, client);
});

client.on("messageReactionAdd", async (reaction, user) => {
  /*
    if (user.bot) return; // If the user was a bot, return.
    if (!reaction.message.guild) return; // If the user was reacting something but not in the guild/server, ignore them.
  
    if (reaction.partial) {
      // If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
      try {
        await reaction.fetch();
      }
      catch (error) {
        console.log('Something went wrong when fetching the message: ', error);
        // Return as `reaction.message.author` may be undefined/null
        return;
      }
    }
  
    events.get('messageReactionAdd').run(client, reaction, user);
  */
});

client.on("messageUpdate", async (oldMessage, newMessage) => {
  await oldMessage.fetch();
  await newMessage.fetch();
  if (oldMessage.content === newMessage.content) {
    return;
  }
  client.events.get("messageUpdate").run(newMessage, oldMessage, client);

});

client.on("messageReactionRemove", async (reaction, user) => {
  /*
    if (user.bot) return;
    if (!reaction.message.guild) return;
  
    if (reaction.partial) {
      // If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
      try {
        await reaction.fetch();
      }
      catch (error) {
        console.log('Something went wrong when fetching the message: ', error);
        // Return as `reaction.message.author` may be undefined/null
        return;
      }
    }
    events.get('messageReactionRemove').run(client, reaction, user);*/
});

client.distube
  .on("playSong", (message, queue, song) => {
      queue.autoplay = false;
    
    const embed = new Discord.MessageEmbed()
      .setTitle(`Monke's playin`)
      .setDescription(
        `Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${song.user}`
      )
      .setFooter(`${status(queue)}`);
    message.channel.send(embed);
  })

  .on("addSong", (message, queue, song) => {
    queue.autoplay = false;
    const embed = new Discord.MessageEmbed()
      .setTitle(`Monke's playin`)
      .setDescription(
        `Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`
      );
    message.channel.send(embed);
  })

  .on("playList", (message, queue, playlist, song) => {
    queue.autoplay = false;
    const embed = new Discord.MessageEmbed()
      .setTitle(`Monke's playin`)
      .setDescription(
        `Play \`${playlist.name}\` playlist (${playlist.songs.length} songs).\nRequested by: ${song.user}\nNow playing \`${song.name}\` - \`${song.formattedDuration}`
      )
      .setFooter(`${status(queue)}`);
    message.channel.send(embed);
  })

  .on("addList", (message, queue, playlist) => {
    queue.autoplay = false;
    const embed = new Discord.MessageEmbed()
    .setTitle(`Monke's Playin`).setDescription(
      `Added \`${playlist.name}\` playlist (${
        playlist.songs.length
      } songs) to queue\n${status(queue)}`
    );
    message.channel.send(embed);
  })

  // DisTubeOptions.searchSongs = true
  .on("searchResult", (message, result) => {
    let i = 0;
    message.channel.send(
      `**Choose an option from below**\n${result
        .map(
          (song) => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``
        )
        .join("\n")}\n*Enter anything else or wait 60 seconds to cancel*`
    );
  })
  // DisTubeOptions.searchSongs = true
  .on("searchCancel", (message) => message.channel.send(`Searching canceled`))
  .on("error", (message, e) => {
    console.error(e);
    message.channel.send("An error encountered: " + e);
  });

client.levels.init(configFileName);
client.mongoose.init(configFileName);

client.login(discord_conf.token);
