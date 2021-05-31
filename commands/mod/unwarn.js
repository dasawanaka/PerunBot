const { MessageEmbed } = require("discord.js");
const GuildSettingsManager = require("../../database/managers/GuildSettingManager");
const WarnManager = require("../../database/managers/WarnManager");
const Command = require("../../assets/class/Command");

class UnWarn extends Command {
  constructor() {
    super({
      name: "unwarn",
      alias: [],
      public: true,
      description: "unwarn a member in your server.",
      usage: [
        "`unwarn <user> <warn number>`",
        "-`<user>` mention a user or type User ID (required)",
        "-`<warn number>` - number of warn from warnlog",
      ],
      examples: ["$warn @user stupid links"],
      clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "BAN_MEMBERS"],
      userPermissions: ["BAN_MEMBERS"],
    });
  }
  async run(client, message, args) {
    const member = message.mentions.members.first()
      ? message.mentions.members.first()
      : message.guild.members.cache.get(args[0]);

    if (!member) {
      return message.channel.send({
        embed: {
          color: 16734039,
          description: "❌ | Please mention a user or provide a valid user ID!",
        },
      });
    }
    if (member === message.member)
      return message.channel.send({
        embed: {
          color: 16734039,
          description: "❌ | You cannot unwarn yourself!",
        },
      });
    if (member.roles.highest.position >= message.member.roles.highest.position)
      return message.channel.send({
        embed: {
          color: 16734039,
          description:
            "❌ | You cannot unwarn someone with an equal or higher role",
        },
      });

    if (!args[1] || !parseInt(args[1]))
      return message.channel.send({
        embed: {
          color: 16734039,
          description: "❌ | provide a valid warn number.",
        },
      });

    let res = await WarnManager.clearWarn(
      member.id,
      message.guild.id,
      message.author.id,
      parseInt(args[1])
    );
    if (!res) {
      return message.channel.send({
        embed: {
          color: 16734039,
          description:
            "❌ | cannot unwarn now, check data and try again later.",
        },
      });
    }

    const embed = new MessageEmbed()
      .setTitle("Clear warn")
      .setDescription(`${member} has been unwarned.`)
      .addField("Moderator", message.member, true)
      .addField("Member", member, true)
      .setFooter(
        message.member.displayName,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setTimestamp()
      .setColor("#ebb402");
    message.channel.send(embed);

    console.log(
      `${message.guild.name}: ${message.author.tag} unwarned ${member.user.tag}`
    );
  }
}

module.exports = UnWarn;
