const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  name: "baka",
  alias: [],
  public: true,
  description: 'BAAAAAAAKA!',
  usage: ["baka [user mention/ID]"],
  examples: ["baka @nurionis"],
  async run(client, message, args) {
    const member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]) ||
      message.member;

      try {
        const response = await fetch("https://nekos.life/api/v2/img/baka")
        const body = await response.json();
        const embed = new MessageEmbed()
         .setTitle(`BAKA! BAAKA! BAAAKA! BAAAAAAAKA!`)
         .setDescription(`:rage: ${member}, you BAAAKA!`)
         .setImage(body.url)
         .setColor("RANDOM")
         .setFooter("Requested by " + `${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 2048 }))
         .setTimestamp()
         .setURL(body.url);
        message.channel.send(embed);
       } catch(err) {
        message.channel.send({embed: {
         color: 16734039,
         description: "Something went wrong... :cry:"
        }})
       }
  },
};
