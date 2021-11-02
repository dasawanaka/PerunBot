const ms = require("ms");

const Timeout = new Map();

module.exports = {
  async run(interaction) {
    var client = interaction.client;
    var message;
    var args;
    var commandName = interaction.commandName;
    console.log("run command")
    const command = client.commands.get(commandName);
    if (command != null) {
      try {
        if (!command.checkPermissions(interaction)) return;

        if (command.cooldown && command.cooldown > 0) {
          if (
            Timeout.has(`${command.name.toLowerCase()}${interaction.member.id}`)
          )
            return interaction.reply(
              `You are on a \`${ms(
                Timeout.get(`${command.name}${interaction.member.id}`) - Date.now(),
                { long: true }
              )}\` cooldown.`
            );
          await command.run(interaction);
          Timeout.set(
            `${command.name}${interaction.member.id}`,
            Date.now() + command.cooldown
          );
          setTimeout(() => {
            Timeout.delete(`${command.name}${interaction.member.id}`);
          }, command.cooldown);
        } else {
          client.logger.debug(
            `User: ${interaction.member.id} use command: ${commandName}`
          );
          command.run(interaction);
        }
      } catch (error) {
        client.logger.error(error.message);
      }
    }
  },
};
