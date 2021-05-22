const ms = require("ms");
const PermissionsChecker = require("./PermissionsChecker");

const Timeout = new Map();

module.exports = {
  async run(client, message, args, commandName) {
    const command = client.commands.get(commandName);
    try {
      if (
        !PermissionsChecker.checkPermissions(
          message,
          command.clientPermissions,
          command.userPermissions,
          commandName
        )
      )
        return;

      //check cooldown
      if (command.cooldown && command.cooldown > 0) {
        if (Timeout.has(`${command.name}${message.author.id}`))
          return message.channel.send(
            `You are on a \`${ms(
              Timeout.get(`${command.name}${message.author.id}`) - Date.now(),
              { long: true }
            )}\` cooldown.`
          );
        command.run(client, message, args);
        Timeout.set(
          `${command.name}${message.author.id}`,
          Date.now() + command.cooldown
        );
        setTimeout(() => {
          Timeout.delete(`${command.name}${message.author.id}`);
        }, command.cooldown);
      } else {
        command.run(client, message, args);
      }
    } catch (error) {
      console.error(error);
    }
  },
};
