const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");
const Command = require("../../assets/class/Command");

class Poke extends Command {
  constructor() {
    super({
      name: "poke",
      alias: [],
      public: true,
      description: "Poke user",
      usage: ["poke [user mention/ID]"],
      examples: ["poke @nurionis"],
    });
  }

  async run(client, message, args) {
    try {
      const member =
        message.mentions.members.first() ||
        message.guild.members.cache.get(args[0]);

      if (!member) {
        return message.channel.send({
          embed: {
            color: 16734039,
            description: "❌ | You must mention someone to poke!",
          },
        });
      }

      if (member.id === message.author.id) {
        return message.channel.send({
          embed: {
            color: 5294200,
            description: "🤦 | You can't poke yourself tfu!",
          },
        });
      }
      if (member.id == client.user.id) {
        return message.channel.send({
          embed: {
            color: 5294200,
            description:
              "🤦 | Oh, you tried to poke me but u cant hehe (hopefully)",
          },
        });
      }

      const response = await fetch("https://nekos.life/api/v2/img/poke");
      const body = await response.json();
      const embed = new MessageEmbed()
        .setAuthor(
          member.displayName +
            " just got a poked from " +
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
          member.toString() + " got a poke from " + message.author.toString()
        )
        .setFooter(
          "Requested by " + `${message.author.username}`,
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
  }
}

module.exports = Poke;
