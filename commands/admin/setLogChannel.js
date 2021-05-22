const LogChannel = require("../../models/log_channel");

module.exports = {
  name: "setlogchannel",
  alias: [],
  public: true,
  description: "Set log channel",
  userPermissions: ['MANAGE_GUILD'],
  usage: "<prefix>setLogChannel <#channel>",
  cooldown: 5000,
  async run(client, message, args) {
    if (!message.mentions.channels.first())
      return message.channel.send("Please tag a **channel**!");

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
          upsert: true
      }
    )
      .then(function (result) {
        message.channel.send(
          `The new log channel is now **\`${targetChannel}\`**`
        );
      })
      .catch(function (err) {
        console.error(err);
        message.channel.send(
          `Could not update log channel now, please try again later.`
        );
      });
  },
};
