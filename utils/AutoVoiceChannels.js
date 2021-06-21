const AutoVC = require("../database/models/autoVc");
const TempChannels = require("discord-temp-channels");

class AutoVoiceChannels {
  constructor(client) {
    this.tempChannels = new TempChannels(client);
    const Guilds = client.guilds.cache.map((guild) => guild.id);

    for (let index = 0; index < Guilds.length; index++) {
      const element = Guilds[index];
      var vcDef = AutoVC.collection.find({ guildID: element }).limit(100);
      if (vcDef.count() === 0) return false;

      vcDef.forEach((vc) => {
        this.tempChannels.registerChannel(vc.channelID, {
          childCategory: vc.parentID,
          childAutoDeleteIfEmpty: true,
          childMaxUsers: vc.maxUsers,
          childFormat: (member, count) =>
            `#${count} | ${member.user.username}'s voice`,
        });
      });
    }
  }
  add(vc) {
    this.tempChannels.registerChannel(vc.channelID, {
      childCategory: vc.parentID,
      childAutoDeleteIfEmpty: true,
      childMaxUsers: vc.maxUsers,
      childFormat: (member, count) =>
        `#${count} | ${member.user.username}'s voice`,
    });
  }
}

module.exports = AutoVoiceChannels;
