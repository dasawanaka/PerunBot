const { MessageEmbed } = require("discord.js");
const GuildSettingsManager = require("../../database/managers/GuildSettingManager");
const WarnManager = require("../../database/managers/WarnManager");
const Command = require("../../assets/class/Command");

class Warn extends Command {
  constructor() {
    super({
      name: "warn",
      alias: [],
      public: true,
      description: "Warns a member in your server.",
      usage: [
        "`warn <user> [reason]`",
        "-`<user>` mention a user or type User ID (required)",
        "-`[reason]` - optional arg",
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
      return message.channel.send(
        "Please mention a user or provide a valid user ID"
      );
    }
    if (member === message.member)
      return message.channel.send("You cannot warn yourself");
    if (member.roles.highest.position >= message.member.roles.highest.position)
      return message.channel.send(
        "You cannot warn someone with an equal or higher role"
      );

    const autoBan = await GuildSettingsManager.getAutoBan(
      message.guild.id,
      message
    );
    let reason = args.slice(1).join(" ");
    if (!reason) reason = "`None`";
    if (reason.length > 1024) reason = reason.slice(0, 1021) + "...";

    let activeWarnCount = await WarnManager.addWarn(
      member.id,
      message.guild.id,
      message.author.id,
      reason
    );

    const embed = new MessageEmbed()
      .setTitle("Warn Member")
      .setDescription(`${member} has been warned.`)
      .addField("Moderator", message.member, true)
      .addField("Member", member, true)
      .addField("Warn Count", `\`${activeWarnCount}\``, true)
      .addField("Reason", reason)
      .setFooter(
        message.member.displayName,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setTimestamp()
      .setColor("#ebb402");
    message.channel.send(embed);

    console.log(
      `${message.guild.name}: ${message.author.tag} warned ${member.user.tag}`
    );

    if (autoBan && activeWarnCount >= autoBan) {
      client.commands
        .get("ban")
        .run(client, message, [
          `Warn limit reached. Automatically banned by ${message.guild.me}.`,
        ]);
    }
  }
}
module.exports = Warn;
