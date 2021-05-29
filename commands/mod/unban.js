const { MessageEmbed } = require("discord.js");

const regex = /^(?:<@!?)?(\d+)>?$/;
const Command = require("../../assets/class/Command");

class Unban extends Command {
  constructor() {
    super({
      name: "unban",
      alias: [],
      public: true,
      description: "Unbans a member from your server.",
      usage: [
        "`unban <user ID> [reason]`",
        "-`<user ID>` - User ID (required)",
        "-`[reason]` - optional arg",
      ],
      examples: ["$unban @user"],
      clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "BAN_MEMBERS"],
      userPermissions: ["BAN_MEMBERS"],
    });
  }
  async run(client, message, args) {
    const id = args[0];
    if (!regex.test(id))
      return message.channel.send("Please provide a valid user ID");
    const bannedUsers = await message.guild.fetchBans();
    const user = bannedUsers.get(id).user;
    if (!user)
      return message.channel.send(
        "Unable to find user, please check the provided ID"
      );

    let reason = args.slice(1).join(" ");
    if (!reason) reason = "`None`";
    if (reason.length > 1024) reason = reason.slice(0, 1021) + "...";

    await message.guild.members.unban(user, reason);
    const embed = new MessageEmbed()
      .setTitle("Unban Member")
      .setDescription(`${user.tag} was successfully unbanned.`)
      .addField("Moderator", message.member, true)
      .addField("Member", user.tag, true)
      .addField("Reason", reason)
      .setFooter(
        message.member.displayName,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setTimestamp()
      .setColor("#00960f");

    message.channel.send(embed);
    console.log(
      `${message.guild.name}: ${message.author.tag} unban ${user.tag}`
    );
  }
}

module.exports = Unban;
