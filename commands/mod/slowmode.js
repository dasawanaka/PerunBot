const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "slowmode",
  alias: ["slow", "sm"],
  public: true,
  description:
    "Enables slowmode in a channel with the specified rate. \nIf no channel is provided, then slowmode will affect the current channel. \nProvide a rate of 0 to disable.",
  usage: ["`slowmode [channel mention/ID] <rate> [reason]`"],
  examples: ["slowmode #general 2", "slowmode 3"],
  clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_CHANNELS"],
  userPermissions: ["MANAGE_CHANNELS"],
  async run(client, message, args) {
    let index = 1;
    let channel = message.mentions.channels.first()
      ? message.mentions.channels.first()
      : message.guild.channels.cache.get(args[0]);
    if (!channel) {
      channel = message.channel;
      index--;
    }

    if (channel.type != "text" || !channel.viewable)
      return message.channel.send(
        "Please mention an accessible text channel or provide a valid text channel ID"
      );

    const rate = args[index];
    if (!rate || rate < 0 || rate > 300)
      message.channel.send(
        "Please provide a rate limit between 0 and 300 seconds"
      );

    if (!channel.permissionsFor(message.guild.me).has(["MANAGE_CHANNELS"]))
      message.channel.send(
        "I do not have permission to manage the provided channel"
      );

    let reason = args.slice(index + 1).join(" ");
    if (!reason) reason = "`None`";
    if (reason.length > 1024) reason = reason.slice(0, 1021) + "...";

    await channel.setRateLimitPerUser(rate, reason); // set channel rate
    const status = channel.rateLimitPerUser ? "enabled" : "disabled";
    const embed = new MessageEmbed()
      .setTitle("Slowmode")
      .setFooter(
        message.member.displayName,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Slowmode disabled
    if (rate === "0") {
      message.channel.send(
        embed
          .setDescription(`\`${status}\` ➔ \`disabled\``)
          .addField("Moderator", message.member, true)
          .addField("Channel", channel, true)
          .addField("Reason", reason)
      );

      // Slowmode enabled
    } else {
      message.channel.send(
        embed
          .setDescription(`\`${status}\` ➔ \`enabled\``)
          .addField("Moderator", message.member, true)
          .addField("Channel", channel, true)
          .addField("Rate", `\`${rate}\``, true)
          .addField("Reason", reason)
      );
    }
    console.log(
        `${message.guild.name}: ${message.author.tag} set slowmode on one channel to ${rate}`
      );
  },
};
