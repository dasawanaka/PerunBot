/* eslint-disable no-inline-comments */
/* eslint-disable indent */
var startTime = Date.now();
const Discord = require("discord.js");
// eslint-disable-next-line no-unused-vars

//get config file name from param
const args = require("minimist")(process.argv.slice(2));
var configFileName;
if (args["config"] === undefined) {
  configFileName = "config.json";
} else {
  configFileName = args["config"];
}
console.log("Use config file: ", configFileName);

const { discord_conf } = require(`./${configFileName}`);
const client = new Discord.Client({
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
  disableEveryone: false,
});

require("discord-buttons")(client);

const path = require("path");
const Distube = require(`distube`);
const ms = require("ms");

const status = (queue) =>
  `Filter: \`${queue.filter || "Off"}\` | Loop: \`${
    queue.repeatMode
      ? queue.repeatMode == 2
        ? "All Queue"
        : "This Song"
      : "Off"
  }\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;

client.mongoose = require("./database/mongoose");
client.levels = require("./utils/levels");
client.distube = new Distube(client, {
  searchSongs: true,
  emitNewSongOnly: true,
});

const paths = {
  commands: path.join(__dirname, "commands"),
  events: path.join(__dirname, "events"),
};
const loader = {
  commands: require("./utils/loadCommands.js"),
  events: require("./utils/loadEvents.js"),
};

client.commands = new Discord.Collection();
client.events = new Discord.Collection();
client.guildSettings = new Discord.Collection();
client.tasks = new Discord.Collection(); //used to cron jobs

loader.commands.load(paths.commands, client);
loader.events.load(paths.events, client);

client.once("ready", () => {
  console.log(`Ready! Bot started now!`);
  console.log(`Run in ${ms(Date.now() - startTime)}`);
});

client.on("clickButton", async (button) => {
  client.events.get("clickButton").run(button, client);
  
});

client.on("guildCreate", (guild) => {
  console.log("Joined a new guild: " + guild.name);
});

client.on("message", async (message) => {
  client.events.get("newMessage").run(message, client);
});

// client.on("messageEmbed", async (message, client) => {
//   await message.fetch();
// client.events.get("newMessageEmbed.js").run(message, client)
// });

client.on("messageDelete", async (message) => {
  client.events.get("messageDelete").run(message, client);
});

client.on("messageUpdate", async (oldMessage, newMessage) => {
  //await oldMessage.fetch();
  //await newMessage.fetch();
  if (oldMessage.content === newMessage.content) {
    return;
  }
  client.events.get("messageUpdate").run(newMessage, oldMessage, client);
});
client.on("messageReactionAdd", async (reaction, user) => {
  if (reaction.message.partial) await reaction.message.fetch(); //if (reaction.message.partial)
  if (reaction.partial) await reaction.fetch();
  if (user.bot) return;
  if (!reaction.message.guild) return;
  // const moderatorRole = reaction.message.guild.roles.cache.find(role => role.name === "Rządny władzy gówniak")
  // const moderatorEmoji = '👍'
  // if (reaction.emocji.name === moderatorEmoji) {
  //     await reaction.message.guild.members.cache.get(user.id).roles.add(moderatorRole);
  // }
  else {
    return;
  }

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
      .setTitle(`Monke's Playin`)
      .setDescription(
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

//handle unhandled rejection error
process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:\n", error);
});

client.levels.init(configFileName);
client.mongoose.init(configFileName);

client.login(discord_conf.token);
