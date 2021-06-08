const Guild = require("../models/guild");
const mongoose = require("mongoose");
const logger = require("../../DefaultLogger").get();

const cache = new Map();

module.exports = {
  async fetch(guildId, message) {
    let guildSettings = cache.get(guildId);

    if (!guildSettings) {
      guildSettings = Guild.findOne({ guildID: guildId }, (err, guild) =>
        getGuildFromDB(err, guild, message)
      );
     
    } else {
      logger.debug(`Use cached guild settings for ${guildSettings.guildName}(ID: ${guildId})`);
    }
    return guildSettings;
  },

  async getAutoBan(guildId, message) {
    let guildSettings = await this.fetch(guildId, message)

    if(!guildSettings.autoBan){
      guildSettings.autoBan = 5;
      guildSettings.save();
    }
    return guildSettings.autoBan;
  }
};

function getGuildFromDB(err, guild, message) {
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
      autoBan: 5
    });
    newGuild
      .save()
      .then((result) => logger.debug(result))
      .catch((err) => logger.error(`${err.message} ${err.stack}`));

      cache.set(message.guild.id, newGuild);

    return message.channel
      .send(
        "This server was not in our database! We have now added and you should be able to use all bot functions."
      )
      .then((m) => m.delete({ timeout: 5000 }));
  }
  return guild;
}
