const LogChannel = require("../../../database/models/log_channel");

module.exports = {
  name: "remove",
  alias: [],
  async run(client, message, args) {
    await LogChannel.deleteOne(
      {
        _id: message.guild.id,
      },
      {
          upsert: true
      }
    )
      .then(function (result) {
        return message.channel.send({
          embed: {
            color: 5294200,
            description: ` 👍 | Remove log channel.`,
          },
        });
      })
      .catch(function (err) {
        console.error(err);
        return message.channel.send({
          embed: {
            color: 16734039,
            description: `❌ | Could not delete log channel now, please try again later.`,
          },
        });
      });
  },
};
