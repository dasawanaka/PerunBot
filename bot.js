/* eslint-disable no-inline-comments */
/* eslint-disable indent */
const Discord = require('discord.js');
// eslint-disable-next-line no-unused-vars
const { discord_conf, giveaway } = require('./config.json');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'], disableEveryone: false });

const fs = require('fs');
const path = require('path');
const colors = require('colors');

//const sqlite3 = require('sqlite3').verbose();
//let db = new sqlite3.Database('./db/db.sqlite');
const paths = {
  commands: path.join(__dirname, 'commands'),
  events: path.join(__dirname, 'events')
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
let events = new Discord.Collection();
let tasks = new Discord.Collection();

const commandModules = fs.readdirSync(paths.commands);
for (const module of commandModules) {
  
  var modulePath = path.join(paths.commands, module);
  const commandFiles = fs.readdirSync(modulePath).filter(file => file.endsWith('.js'));

  console.log(colors.bold.bgGreen.yellow(``) + colors.green(`[MODULE] find module ${module} with ${commandFiles.length} commands.`))

  if (commandFiles.length > 0) {
    for (const file of commandFiles) {
      const commandPath = path.join(paths.commands, module, file);
      const command = require(commandPath);
      client.commands.set(command.name, command);
      command.alias.forEach(al => {
        client.commands.set(al, command);
      });
      console.log(colors.bold.bgGreen.yellow(`[DONE]`) + colors.green(` load command ${command.name} from ${commandPath}`))
    }
  }

}

client.once('ready', () => {
  console.log(colors.rainbow(`Ready! Bot started now!`));
});

client.on('message', async message => {

  if (!(message.content.startsWith(discord_conf.prefix))
    || message.author.bot || message.channel.type === 'dm') {
    return;
  }

  if (message.content.startsWith(discord_conf.prefix)) {

    const args = message.content.slice(discord_conf.prefix.length).trim().split(/ +/);

    const command = args.shift().toLowerCase();

    if (!client.commands.has(command)) return;

    try {
      client.commands.get(command).run(client, message, args);

    } catch (error) {
      console.error(error);
    }
  }
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

client.login(discord_conf.token);