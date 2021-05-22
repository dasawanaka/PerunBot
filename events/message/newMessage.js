const GuildSettingsManager = require("../../database/managers/GuildSettingManager.js");
const MessageExpAndLevel = require("../../utils/MessageExpAndLevel.js");
const CommandExecutioner = require("../../utils/CommandExecutioner.js");

module.exports = {
  name: "newMessage",
  description: "this is event for new message",
  async run(message, client) {
    if (message.author.bot || message.channel.type === "dm") {
      return;
    }

    let guildId = message.guild.id;
    let guildSettings = await GuildSettingsManager.fetch(guildId, message);
    var prefix = guildSettings.prefix;

    if (!message.content.startsWith(prefix)) {
      await MessageExpAndLevel.run(message);
      return;
    }

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return;

    CommandExecutioner.run(client, message, args, commandName);
  },
};
