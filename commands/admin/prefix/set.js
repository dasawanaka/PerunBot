const Guild = require("../../../database/models/guild");

const prefixList = ["$", "!", "%", ".", ",", ">", "<", ";", ":"];

module.exports = {
  name: "set",
  alias: [],
  async run(client, message, args) {
    const guildSettings = await Guild.findOne({
      guildID: message.guild.id,
    });

    if (!args[0])
      return message.channel.send({
        embed: {
          color: 16734039,
          description: `❌ | You must provide a **new prefix**! Available prefix list: \`\`${prefixList.join(
            "  "
          )} \`\``,
        },
      });

    if (!prefixList.includes(args[0]))
      return message.channel.send({
        embed: {
          color: 16734039,
          description: `❌ | You must provide a **valid prefix**! Available prefix list: \`\`${prefixList.join(
            "  "
          )} \`\``,
        },
      });

    if (guildSettings) {
      await Guild.findOneAndUpdate(
        {
          guildID: message.guild.id,
        },
        { $set: { prefix: args[0] } }
      )
        .then(function (result) {
          console.log(result);

          return message.channel.send({
            embed: {
              color: 5294200,
              description: ` 👍 | The new prefix is now **\`${args[0]}\`**`,
            },
          });
        })
        .catch(function (err) {
          console.error(err);
          return message.channel.send({
            embed: {
              color: 16734039,
              description: `❌ | Could not update prefix now, please try again later.`,
            },
          });
        });
    } else if (!guildSettings) {
      return message.channel.send({
        embed: {
          color: 16734039,
          description: `❌ | Could not update prefix now, please try again later.`,
        },
      });
    }
  },
};
