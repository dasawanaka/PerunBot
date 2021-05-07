/* eslint-disable no-inline-comments */
/* eslint-disable indent */
const Discord = require('discord.js');
// eslint-disable-next-line no-unused-vars
const { discord_conf, giveaway } = require('./config.json');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'], disableEveryone: false });

const fs = require('fs');
const path = require('path');
const colors = require('colors');
const Guild = require('./models/guild');

client.mongoose = require('./utils/mongoose');
client.levels = require('./utils/levels');

const paths = {
  commands: path.join(__dirname, 'commands'),
  events: path.join(__dirname, 'events')
};
const loader = {
  commands: require('./functions/loadCommands.js'),
  events: require('./functions/loadEvents.js')
};

const { GiveawaysManager } = require('discord-giveaways');
const { filter } = require('mathjs');
client.giveawayConfig = giveaway;
client.giveawaysManager = new GiveawaysManager(client, {
  storage: "./giveaways.json",
  updateCountdownEvery: 5000,
  default: {
    botsCanWin: false,
    exemptPermissions: [],
    embedColor: "#009e08",
    reaction: "🎉"
  }
});

client.commands = new Discord.Collection();
client.events = new Discord.Collection();
client.guildSettings = new Discord.Collection();
client.tasks = new Discord.Collection();

loader.commands.load(paths.commands, client);
loader.events.load(paths.events, client);

client.once('ready', () => {
  console.log(colors.rainbow(`Ready! Bot started now!`));
});

client.on("guildCreate", guild => {
  console.log("Joined a new guild: " + guild.name);
  
})

client.on('message', async message => {

  client.events.get('newMessage').run(message, client);

});

client.on('messageReactionAdd', async (reaction, user) => {
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
  if (oldMessage.content === newMessage.content) {
    return;
  }
  /*
   if (oldMessage.partial) {
     try {
       await oldMessage.fetch();
     } catch (error) {
       console.log('Something went wrong when fetching the message: ', error);
       // Return as `reaction.message.author` may be undefined/null
       return;
     }
   }
 
   if (newMessage.partial) {
     try {
       await newMessage.fetch();
     } catch (error) {
       console.log('Something went wrong when fetching the message: ', error);
       // Return as `reaction.message.author` may be undefined/null
       return;
     }
   }
 
   var embed = new Discord.MessageEmbed()
     .setColor('#fca00a')
     //.setAuthor(newMessage.author.tag, newMessage.author.avatar)
     .setThumbnail(newMessage.author.displayAvatarURL())
     .setDescription(`Message edited in <#${newMessage.channel.id}> [Go to message](${newMessage.url})`)
     .addFields(
       { name: `User`, value: `${newMessage.author.tag}`, inline: true },
       { name: `UserID`, value: `${newMessage.author.id}`, inline: true },
       //{ name: '\u200B', value: '\u200B' },
       { name: 'Before', value: `${oldMessage.content}` },
       { name: 'After', value: `${newMessage.content}` }
     )
     .setTimestamp()
     .setFooter(`${client.user.username} - modlog`, client.user.avatarURL());
 
   newMessage.guild.systemChannel.send(embed);
     */
});


client.on('messageReactionRemove', async (reaction, user) => {
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

client.levels.init();
client.mongoose.init();
client.login(discord_conf.token);