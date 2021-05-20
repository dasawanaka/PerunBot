const { MessageEmbed } = require("discord.js");
const LOGGER = require("../../class/logger");

module.exports = {
  name: "messageDelete",
  description: "this is event for delete message",
  async run(message, client) {
    if (message.partial) await message.fetch();
    
    const { content, channel, author, guild, mentions } = message;
    
    if (!author || author.bot || channel.type === "dm") {
      return;
    }

    if (mentions.users.size === 0) {
      let embed = new MessageEmbed()
        .setTitle("Message Deleted")
        .setDescription(`Message content:\n${content}`)
        .addField("Channel", channel)
        .addField("Message author", author)
        .setColor("#f55742");

      LOGGER.log(guild, embed)
      return;
    }

    let embed = new MessageEmbed()
      .setTitle("Possible ghost ping detected")
      .setDescription(`Message content:\n${content}`)
      .addField("Channel", channel)
      .addField("Mentions count", `${mentions.users.size}`)
      .addField("Message author", author)
      .setColor("#f55742");

    LOGGER.log(guild, embed);
  },
};
