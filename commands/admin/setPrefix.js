const Guild = require("../../models/guild");

module.exports = {
  name: "setprefix",
  alias: [],
  public: true,
  description: "Set new prefix command",
  userPermissions: ["MANAGE_GUILD"],
  usage: "<prefix>setPrefix <newPrefix>",
  cooldown: 5000,
  async run(client, message, args) {
    const guildSettings = await Guild.findOne({
      guildID: message.guild.id,
    });

    if (!args[0])
      return message.channel.send("You must provide a **new prefix**!");
    if (args[0].length >= 6)
      return message.channel.send(
        "Your new prefix must be under `6` characters!"
      );

    if (guildSettings) {
      await Guild.findOneAndUpdate(
        {
          guildID: message.guild.id,
        },
        { $set: { prefix: args[0] } }
      )
        .then(function (result) {
          console.log(result);
          message.channel.send(`The new prefix is now **\`${args[0]}\`**`);
        })
        .catch(function (err) {
          console.error(err);
          message.channel.send(
            `Could not update prefix now, please try again later.`
          );
        });
    } else if (!guildSettings) {
      message.channel.send(
        `Could not update prefix now, please try again later.`
      );
    }
  },
};
