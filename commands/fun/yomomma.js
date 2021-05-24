const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  name: "yomomma",
  alias: ["yourmom", "yomamma", "yomama", "ym"],
  public: true,
  description:
    'Says a random "yo momma" joke to the specified user. If no user is given, then the joke will be directed at you!',
  usage: ["yomomma [user mention/ID]"],
  examples: ["yomomma @nurionis"],
  async run(client, message, args) {
    const member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]) ||
      message.member;

      try {
        const res = await fetch('https://api.yomomma.info');
        let joke = (await res.json()).joke;
        joke = joke.charAt(0).toLowerCase() + joke.slice(1);
        if (!joke.endsWith('!') && !joke.endsWith('.') && !joke.endsWith('"')) joke += '!';
        const embed = new MessageEmbed()
          .setTitle('🍼  Yo Momma  🍼')
          .setDescription(`${member}, ${joke}`)
          .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
          .setTimestamp()
          .setColor(message.guild.me.displayHexColor);
        message.channel.send(embed);
      } catch (err) {
        console.error(err.stack);
        message.channel.send('Please try again in a few seconds', err.message);
      }
  },
};
