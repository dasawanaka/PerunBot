const LogChannel = require("../../../database/models/log_channel");
const Command = require("../../../assets/class/Command");

class SetLogChannel extends Command {
  constructor() {
    super({
      name: "set",
      alias: [],
    });
  }
  async run(client, message, args) {
    if (!message.mentions.channels.first())
      return message.channel.send({
        embed: {
          color: 16734039,
          description: `❌ | Please tag a **channel**!`,
        },
      });

    var targetChannel = message.mentions.channels.first();

    await LogChannel.findOneAndUpdate(
      {
        _id: message.guild.id,
      },
      {
        $set: {
          _id: message.guild.id,
          channelID: targetChannel.id,
        },
      },
      {
        upsert: true,
      }
    )
      .then(function (result) {
        return message.channel.send({
          embed: {
            color: 5294200,
            description: ` 👍 | The new log channel is now **${targetChannel}**`,
          },
        });
      })
      .catch(function (err) {
        console.error(err);
        return message.channel.send({
          embed: {
            color: 16734039,
            description: `❌ | Could not update log channel now, please try again later.`,
          },
        });
      });
  }
}
module.exports = SetLogChannel;
