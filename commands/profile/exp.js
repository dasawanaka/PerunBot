const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "exp",
  alias: [],
  public: true,
  description: "Information on how to get experience",
  usage: [
    "exp",
  ],
  examples: ["$exp"],
  async run(client, message, args) {
    const embed = new MessageEmbed()
      .setTitle('Experience')
      .setDescription(`Per day you can get **unlimited** experience for writing a message.\n**5-10 exp(random)** for **one message per minute.**\n Commands doesn't give experience.`)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  },
};
