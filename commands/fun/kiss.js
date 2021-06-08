const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");
const Command = require("../../assets/class/Command");

class Kiss extends Command {
  constructor() {
    super({
      name: "kiss",
  alias: [],
  public: true,
  description: "Give a kiss to mention user",
  usage: ["kiss [user mention/ID]"],
  examples: ["kiss @user"],
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
            description: "💔 | You must mention user to kiss ;-;",
          },
        });
      }

      if (member.id === message.author.id) {
        return message.channel.send({
          embed: {
            color: 5294200,
            description:
              "💔 | You cant kiss yourself ;-; (Try kissing someone else, your love. Maybe you need some help?)",
          },
        });
      }
      if (member.id == client.user.id) {
        return message.channel.send({
          embed: {
            color: 5294200,
            description:
              "💔 | Oh, you tried to kiss me but u can't... Im not real... But I can kiss you ＼( ^o^ )／",
          },
        });
      }

      const response = await fetch("https://nekos.life/api/v2/img/kiss");
      const body = await response.json();
      const embed = new MessageEmbed()
     .setAuthor(member.displayName + " just got a kiss from " + message.author.username, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 2048 }))
     .setDescription("So sweeet :3")
     .setImage(body.url)
     .setColor("RANDOM")
     .setFooter("Requested by " + `${message.author.username} • (this is so cute ＼( ^o^ )／)`, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 2048 }))
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


module.exports = Kiss;
