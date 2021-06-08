const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");
const Command = require("../../assets/class/Command");

class Slap extends Command {
  constructor() {
    super({
      name: "slap",
      alias: [],
      public: true,
      description: "Slap a user",
      usage: ["slap [user mention/ID]"],
      examples: ["kiss @user"]
    })
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
            description: "❌ | Mention a valid member of this server!",
          },
        });
      }

      if (member.id === message.author.id) {
        return message.channel.send({
          embed: {
            color: 5294200,
            description:
              "❌ | You cant slap yourself!",
          },
        });
      }

      const response = await fetch("https://nekos.life/api/v2/img/slap");
      const body = await response.json();
      const embed = new MessageEmbed()
     .setAuthor(member.displayName + " just got a slapped by " + message.author.username, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 2048 }))
     .setDescription("That must hurt ._.")
     .setImage(body.url)
     .setColor("RANDOM")
     .setFooter("Requested by " + `${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 2048 }))
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
      client.logger.error(`${err.message} ${err.stack}`);
    }
  }
}


module.exports = Slap;
