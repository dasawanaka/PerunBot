const { MessageEmbed } = require("discord.js");
const GuildSettingsManager = require("../../database/managers/GuildSettingManager");
const WarnManager = require("../../database/managers/WarnManager");
const Command = require("../../assets/class/Command");
const pagination = require("discord.js-pagination");
const dateFormat = require("dateformat");

class Warns extends Command {
  constructor() {
    super({
      name: "warns",
      alias: ["warnlog"],
      public: true,
      description: "Warns a member in your server.",
      usage: ["`warns`"],
      examples: ["warns"],
    });
  }
  async run(client, message, args) {
    let member = message.mentions.members.first()
      ? message.mentions.members.first()
      : message.guild.members.cache.get(args[0]);

    if (!args[0]) {
      member = message.author;
    }

    if (!member) {
      return message.channel.send(
        "Please mention a user or provide a valid user ID"
      );
    }

    let warnList = await WarnManager.fetch(member.id, message.guild.id);

    if (!warnList)
      return message.channel.send({
        embed: {
          color: 16734039,
          description: "❌ | No warns found!",
        },
      });
    let warnsEmbeds = [];
    let desc = "";

    warnList.forEach((warn) => {
      let line = "";
      if (warn.cleared) line += "~~";
      line += warn.warnID + ". ";
      line +=
        warn.reason +
        " (" +
        dateFormat(warn.date, "mmmm dS, yyyy, h:MM TT") +
        ")";

      if (warn.cleared) line += "~~";

      if (desc.length + line.length > 1024) {
        const embed = new MessageEmbed()
          .setAuthor(
            `Warn list for ${member.displayName}`,
            message.guild.iconURL({
              dynamic: true,
              format: "png",
              size: 2048,
            })
          )
          .setDescription(`${desc}`)
          .setFooter(
            message.member.displayName,
            message.author.displayAvatarURL({ dynamic: true })
          )
          .setTimestamp()
          .setColor("#ebb402");

        warnsEmbeds.push(embed);
        desc = "";
      }

      desc += line + "\n";
    });

    if (desc.length == 0) {
      message.channel.send({
        embed: {
          color: 16734039,
          description: "❌ | No warns!",
        },
      });
      return;
    }
    const embed = new MessageEmbed()
      .setAuthor(
        `Warn list for ${member.displayName}`,
        message.guild.iconURL({
          dynamic: true,
          format: "png",
          size: 2048,
        })
      )
      .setDescription(`${desc}`)
      .setFooter(
        message.member.displayName,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setTimestamp()
      .setColor("#ebb402");

    warnsEmbeds.push(embed);
    if (warnsEmbeds.length === 1) {
      return message.channel.send(warnsEmbeds[0]);
    }
    const emojiList = ["⏪", "⏩"];
    const timeout = "30000";
    pagination(message, warnsEmbeds, emojiList, timeout);
  }
}
module.exports = Warns;
