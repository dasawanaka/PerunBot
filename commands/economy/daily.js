const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "daily",
  alias: [],
  public: true,
  description: "Information on how to get daily coins",
  usage: [
    "daily",
  ],
  examples: ["$daily"],
  cooldown: 1000,
  async run(client, message, args) {
    const embed = new MessageEmbed()
      .setTitle('Daily')
      .setDescription(`Per day you can get 150 coins for writing a message.\n**1 coin** for one message per minute, experience has a similar limitation`)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  },
};
