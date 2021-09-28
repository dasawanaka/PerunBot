const AutoVC = require("../database/models/autoVc");
const TempChannels = require("discord-temp-channels");

class AutoVoiceChannels {
    
  constructor(client) {
    this.tempChannels = new TempChannels(client);
    const Guilds = client.guilds.cache.map((guild) => guild.id);

    for (let index = 0; index < Guilds.length; index++) {
      const element = Guilds[index];
      //max 50 autoVC per server, is totally overkill
      var vcDef = {};
      try {
        vcDef = AutoVC.collection.find({ guildID: element }).limit(50);
      } catch (error) {
        vcDef.count = () => {return 0};
      }
      
      if (vcDef.count() === 0) continue;

      vcDef.forEach((vc) => {
        var parentID = vc.parentID;
        if(parentID === null) {
          client.logger.error("Invalid auto voice channels data, parent is null: " + JSON.stringify(vc));
          return 0;
        }
        
        try {
          if(parentID && parentID.includes("<#")){
            parentID = parentID.replace("<#", "");
            parentID = parentID.replace(">", "");
          }
        } catch (error) {
            client.logger.error("Invalid auto voice channels data, parent is not a string: " + JSON.stringify(vc));
        }
        
        this.tempChannels.registerChannel(vc.channelID, {
          childCategory: parentID,
          childAutoDeleteIfEmpty: true,
          childMaxUsers: vc.maxUsers,
          childFormat: (member, count) =>
            `#${count} | ${member.user.username}'s voice`,
        });
      });
    }
  }
  add(vc) {
    var parentID = vc.parentID;
        if(parentID.contains("<#")){
          parentID = parentID.replace("<#", "");
          parentID = parentID.replace(">", "");
        }
    this.tempChannels.registerChannel(vc.channelID, {
      childCategory: parentID,
      childAutoDeleteIfEmpty: true,
      childMaxUsers: vc.maxUsers,
      childFormat: (member, count) =>
        `#${count} | ${member.user.username}'s voice`,
    });
  }
}

module.exports = AutoVoiceChannels;
