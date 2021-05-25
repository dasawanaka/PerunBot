const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "coinflip",
  alias: ["cf", "cointoss", "coin", "flip"],
  public: true,
  description: "Flips a coin.",
  usage: [
    "<prefix>coinflip",
  ],
  examples: ["$coinflip"],
  async run(client, message, args) {
    const n = Math.floor(Math.random() * 2);
    let result;
    if (n === 1) result = 'heads';
    else result = 'tails';
    const embed = new MessageEmbed()
      .setTitle('½  Coinflip  ½')
      .setDescription(`I flipped a coin for you, ${message.member}. It was **${result}**!`)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  },
};
