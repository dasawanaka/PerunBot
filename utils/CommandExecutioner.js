const ms = require("ms");

const Timeout = new Map();

module.exports = {
  async run(client, message, args, commandName) {
    const command = client.commands.get(commandName);
    try {
      if (!command.checkPermissions(message)) return;

      if (command.cooldown && command.cooldown > 0) {
        if (Timeout.has(`${command.name.toLowerCase()}${message.author.id}`))
          return message.channel.send(
            `You are on a \`${ms(
              Timeout.get(`${command.name}${message.author.id}`) - Date.now(),
              { long: true }
            )}\` cooldown.`
          );
        client.logger.debug(
          `User: ${message.author.tag} use command: ${commandName} ${
            args && args.length > 0 ? "with args: " + args : ""
          }`
        );
        await command.run(client, message, args);
        Timeout.set(
          `${command.name}${message.author.id}`,
          Date.now() + command.cooldown
        );
        setTimeout(() => {
          Timeout.delete(`${command.name}${message.author.id}`);
        }, command.cooldown);
      } else {
        client.logger.debug(
          `User: ${message.author.tag} use command: ${commandName} ${
            args && args.length > 0 ? "with args: " + args : ""
          }`
        );
        command.run(client, message, args);
      }
    } catch (error) {
      console.error(error.message);
    }
  },
};
