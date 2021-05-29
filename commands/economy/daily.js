const { MessageEmbed } = require("discord.js");
const Command = require("../../assets/class/Command");

class Daily extends Command {
  constructor() {
    super({
      name: "daily",
      alias: ["dly"],
      public: true,
      description: "Information on how to get daily coins",
      usage: ["daily"],
      examples: ["$daily"],
    });
  }

  async run(client, message, args) {
    const embed = new MessageEmbed()
      .setTitle("Daily")
      .setDescription(
        `Per day you can get 150 coins for writing a message.\n**1 coin** for one message per minute. Commands doesn't give coins.`
      )
      .setFooter(
        message.member.displayName,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
}

module.exports = Daily;
