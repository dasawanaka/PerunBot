const { MessageEmbed } = require("discord.js");
const Command = require("../../assets/class/Command");

class Vote extends Command {
  constructor() {
    super({
      name: "vote",
      alias: ["v"],
      public: true,
      description: "this is a vote command",
      clientPermissions: ["MANAGE_MESSAGES"],
      usage: ["<prefix>vote <topic..>"],
      cooldown: 240000,
    });
  }
  async run(client, message, args) {
    try {
      if (!args[0]) {
        message.channel.send({
          embed: {
            color: 16734039,
            description:
              "❌ | Enter your voting topic. You need to enter the command again with arg.",
          },
        });
        throw new Error("Empty vote topic");
      }
      if (args.join(" ").length > 250) {
        message.channel.send({
          embed: {
            color: 16734039,
            description:
              "❌ | To long...Max topic characters is 250. You need to enter the command again.",
          },
        });
        throw new Error("Vote topic to long.");
      }
      const embed = new MessageEmbed()
        .setAuthor(
          `${message.author.tag}`,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setTitle(`Vote now: `)
        .setDescription(
          `${args.join(
            " "
          )}\n\nTo vote react with emoji: \nUPVOTE: 🔼  |  DOWNVOTE: 🔽`
        );
      const embedMessage = await message.channel.send(embed);

      await embedMessage.react("🔼");
      await embedMessage.react("🔽");

      message
        .delete({ timeout: 1000 })
        .catch(console.error);
    } catch (err) {
      client.logger.error(`One of the emojis failed to react: ${err.message} ${err.stack}`);
    }
  }
}
module.exports = Vote;
