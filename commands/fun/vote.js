const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "vote",
  alias: ["v"],
  public: true,
  description: "this is a vote command",
  clientPermissions: ["MANAGE_MESSAGES"],
  usage: "<prefix>vote <topic..>",
  cooldown: 240000,
  async run(client, message, args) {
    try {
      if (!args[0])
        return message.channel.send(
          "Enter your voting topic. You need to enter the command again."
        );
        if(args.join(' ').length>250)  return message.channel.send(
            "To long... You need to enter the command again."
          );
      const embed = new MessageEmbed()
        .setAuthor(
          `${message.author.tag}`,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setTitle(`Vote now: `)
        .setDescription(`${args.join(" ")}\n\nTo vote react with emoji: \nUPVOTE: 🔼  |  DOWNVOTE: 🔽`);
      const embedMessage = await message.channel.send(embed);

      await embedMessage.react("🔼");
      await embedMessage.react("🔽");

      message
        .delete({ timeout: 1000 })
        .then((msg) =>
          console.log(
            `Deleted message from ${msg.author.username} after 5 seconds`
          )
        )
        .catch(console.error);

    } catch (error) {
      console.error("One of the emojis failed to react.");
    }
  },
};
