const { MessageEmbed } = require("discord.js");
const Command = require("../../assets/class/Command");

class Kick extends Command {
  constructor() {
    super({
      name: "kick",
      alias: [],
      public: true,
      description: "Kicks a member from your server.",
      usage: [
        "`<prefix>kick <user> [reason]`",
        "-`<user>` mention a user or type User ID (required)",
        "-`[reason]` - optional arg",
      ],
      examples: ["$ban @"],
      clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "KICK_MEMBERS"],
      userPermissions: ["KICK_MEMBERS"],
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
      return message.channel.send("You cannot ban yourself");
    if (member.roles.highest.position >= message.member.roles.highest.position)
      return message.channel.send(
        "You cannot kick someone with an equal or higher role"
      );
    if (!member.kickable)
      return message.channel.send("Provided member is not kickable");

    let reason = args.slice(1).join(" ");
    if (!reason) reason = "`None`";
    if (reason.length > 1024) reason = reason.slice(0, 1021) + "...";

    await member.kick(reason);

    const embed = new MessageEmbed()
      .setTitle("Kick Member")
      .setDescription(`${member} was successfully kicked.`)
      .addField("Moderator", message.member, true)
      .addField("Member", member, true)
      .addField("Reason", reason)
      .setFooter(
        message.member.displayName,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setTimestamp()
      .setColor("#ba5d00");
    message.channel.send(embed);
    console.log(
      `${message.guild.name}: ${message.author.tag} kicked ${member.user.tag}`
    );
  }
}

module.exports = Kick;
