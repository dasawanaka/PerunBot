const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  name: "hug",
  alias: ["cuddle"],
  public: true,
  description: "Give a hug to mention user",
  usage: ["hug [user mention/ID]"],
  examples: ["hug @nurionis"],
  async run(client, message, args) {
    try {
      const member =
        message.mentions.members.first() ||
        message.guild.members.cache.get(args[0]);

      if (!member) {
        return message.channel.send({
          embed: {
            color: 16734039,
            description: "❌ | You must mention someone to hug!",
          },
        });
      }

      if (member.id === message.author.id) {
        return message.channel.send({
          embed: {
            color: 5294200,
            description:
              "😁 | You can't hug yourself but... Ok, get the hug from me ＼( ^o^ )／ !",
          },
        });
      }
      if (member.id == client.user.id) {
        return message.channel.send({
          embed: {
            color: 5294200,
            description:
              "😁 | Oh, you tried to hug me but u can't... Im not real... But I can hug you ＼( ^o^ )／",
          },
        });
      }

      const response = await fetch("https://nekos.life/api/v2/img/cuddle");
      const body = await response.json();
      const embed = new MessageEmbed()
        .setAuthor(
          member.displayName +
            " Just got a hug from " +
            message.author.username,
          message.author.displayAvatarURL({
            dynamic: true,
            format: "png",
            size: 2048,
          })
        )
        .setImage(body.url)
        .setURL(body.url)
        .setColor("RANDOM")
        .setDescription(
          member.toString() + " got a hug from " + message.author.toString()
        )
        .setFooter(
          "Requested by " +
            `${message.author.username}` +
            " • (this is so cute ＼( ^o^ )／)",
          message.author.displayAvatarURL({
            dynamic: true,
            format: "png",
            size: 2048,
          })
        )
        .setTimestamp()
        .setURL(body.url);
      message.channel.send(embed);
    } catch (err) {
      message.channel.send({
        embed: {
          color: 16734039,
          description: "Something went wrong... :cry:",
        },
      });
      console.log(err);
    }
  },
};
