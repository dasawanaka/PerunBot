const { Collection } = require("discord.js");
const LogChannel = require("../models/log_channel.js");
const cache = new Collection();

class Logger {
  static async init() {}

  static async log(guild, messageEmbed) {
    let serverLogChannel = cache.get(guild.id);
    if (!serverLogChannel) {
      let result = await LogChannel.findById(guild.id);
      if (!result) return;
      cache.set(guild.id, result.channelID);
      serverLogChannel = result.channelID;
    }

    const targetChannel = guild.channels.cache.get(serverLogChannel);
    if (targetChannel) {
      targetChannel.send(messageEmbed);
    }
  }
}

module.exports = Logger;
