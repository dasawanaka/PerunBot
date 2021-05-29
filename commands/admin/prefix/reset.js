const Guild = require("../../../database/models/guild");

const Command = require("../../../assets/class/Command");

class ResetPrefix extends Command {
  constructor() {
    super({
      name: "reset",
      alias: [],
    });
  }

  async run(client, message, args) {
    const guildSettings = await Guild.findOne({
      guildID: message.guild.id,
    });

    if (guildSettings) {
      await Guild.findOneAndUpdate(
        {
          guildID: message.guild.id,
        },
        { $set: { prefix: "$" } }
      )
        .then(function (result) {
          console.log(result);
          return message.channel.send({
            embed: {
              color: 5294200,
              description: ` 👍 | The new prefix is now **\`$\`**`,
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
  }
}
module.exports = ResetPrefix;
