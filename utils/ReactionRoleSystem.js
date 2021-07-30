const ReactionRole = require("../database/models/reaction_roles");

class ReactionRoleSystem {
  constructor(client) {
    this.reactionRolesData = [];
    const Guilds = client.guilds.cache.map((guild) => guild.id);

    for (let index = 0; index < Guilds.length; index++) {
      const g = Guilds[index];
      //max 100 reaction roles per server, is totally overkill
      var rrDef = ReactionRole.collection.find({ guildID: g }).limit(100);
      if (rrDef.count() === 0) return false;

      var messagesFetched = new Map();
      rrDef.forEach((rr) => {
        reactionRolesData.push(rr);

        if(messagesFetched.has(rr.messageID)) continue;

        //when message is not cached RR not working
        client.channels
          .fetch(rr.channelID)
          .then((channel) =>
            channel.messages.fetch(rr.messageID).catch((error) => {
              client.logger.error(error);
            })
          )
          .catch((error) => {
            client.logger.error(error);
          });

          messagesFetched.set(rr.messageID, true);
      });
    }
  }

  async addReactionRole(reactionRole) {
    reactionRolesData.push(reactionRole);
  }

  async deleteReactionRole(messageID, reaction) {}

  async processAddReaction(client, reaction, user) {
    let emojiID;

    if (reaction.emoji.id != null) {
        emojiID = reaction.emoji.id;
    } else {
        //if emoji don't find by id try to find by name
        emojiID = reaction.emoji.name;
    }
    let messageID = reaction.message.id;
    let channelID = reaction.message.channel.id;
    let guildID = reaction.message.guild.id;

    for (const rr in this.reactionRolesData) {
        if(rr.guildID == guildID && rr.channelID == channelID && rr.messageID== messageID && rr.emoji == emojiID){
            user.roles.add(rr.roleID);
        }
    }

  }
  async processRemoveReaction(client, reaction, user) {
    let emojiID;

    if (reaction.emoji.id != null) {
        emojiID = reaction.emoji.id;
    } else {
        //if emoji don't find by id try to find by name
        emojiID = reaction.emoji.name;
    }
    let messageID = reaction.message.id;
    let channelID = reaction.message.channel.id;
    let guildID = reaction.message.guild.id;

    for (const rr in this.reactionRolesData) {
        if(rr.guildID == guildID && rr.channelID == channelID && rr.messageID== messageID && rr.emoji == emojiID){
            user.roles.remove(rr.roleID);
        }
    }
  }
}

module.exports = ReactionRoleSystem;
