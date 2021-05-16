const Guild = require("../../models/guild");
const mongoose = require("mongoose");
const Levels = require("discord-xp");
const { Collection } = require("discord.js");
const ms = require("ms");
const Coins = require("../../class/coins.js");

const Timeout = new Collection();

const expCD = new Collection();

module.exports = {
  name: "newMessage",
  description: "this is event for new message",
  async run(message, client) {
    if (message.author.bot || message.channel.type === "dm") {
      return;
    }

    let guildId = message.guild.id;
    let guildSettings = client.guildSettings.get(guildId);
    var prefix;
    if (!guildSettings) {
      guildSettings = await Guild.findOne(
        { guildID: guildId },
        (err, guild) => {
          if (err) console.error(err);
          if (!guild) {
            const newGuild = new Guild({
              _id: mongoose.Types.ObjectId(),
              guildID: message.guild.id,
              guildName: message.guild.name,
              prefix: "$",
              testServer: false,
              premium: false,
              disabledModules: ["none"],
            });
            newGuild
              .save()
              .then((result) => console.log(result))
              .catch((err) => console.error(err));

            client.guildSettings.set(guildId, newGuild);

            return message.channel
              .send(
                "This server was not in our database! We have now added and you should be able to use all bot functions."
              )
              .then((m) => m.delete({ timeout: 5000 }));
          }
          return guild;
        }
      );
    }

    prefix = guildSettings.prefix;

    if (!message.content.startsWith(prefix)) {
        //exp on messages, when not use commands
      if (expCD.has(`${message.author.id}_${message.guild.id}`)) return;
      const randomXp = Math.floor(Math.random() * 15) + 5;
      const hasLeveledUp = await Levels.appendXp(
        message.author.id,
        message.guild.id,
        randomXp
      );
      if (hasLeveledUp) {
        const user = await Levels.fetch(message.author.id, message.guild.id);
        message.channel.send(
          `Congrats! You leveled up to ${user.level}! Keep it going! $1000 added to your account `
        );
        Coins.appendCoins(message.author.id, message.guild.id, 1000);
      }
      expCD.set(`${message.author.id}_${message.guild.id}`, Date.now() + 60000);
      setTimeout(() => {
        expCD.delete(`${message.author.id}_${message.guild.id}`);
      }, 60000);

      return;
    }

    const args = message.content.slice(prefix.length).trim().split(/ +/);

    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return;
    const command = client.commands.get(commandName);
    //check cooldown on command
    try {
      if (command.cooldown && command.cooldown > 0) {
        if (Timeout.has(`${command.name}${message.author.id}`))
          return message.channel.send(
            `You are on a \`${ms(
              Timeout.get(`${command.name}${message.author.id}`) - Date.now(),
              { long: true }
            )}\` cooldown.`
          );
        command.run(client, message, args);
        Timeout.set(
          `${command.name}${message.author.id}`,
          Date.now() + command.cooldown
        );
        setTimeout(() => {
          Timeout.delete(`${command.name}${message.author.id}`);
        }, command.cooldown);
      } else {
        command.run(client, message, args);
      }
    } catch (error) {
      console.error(error);
    }
  },
};
