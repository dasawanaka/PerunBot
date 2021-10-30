const commandExecutioner = require("./../utils/command/CommandExecutioner")

module.exports = {
  name: "interactionCreate",
  execute(interaction) {
    if (interaction.isCommand()) {
      commandExecutioner.run(interaction)
    }
    console.log(interaction);
    console.log(
      `${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`
    );
  },
};
