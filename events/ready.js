const path = require("path");

module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    client.logger.info(`Ready! Bot started now! Logged in as ${client.user.tag}`);
    for (let index = 0; index < 10; index++) {
      client.logger.debug(`⚠️ _ _ APP ON DEV MODE _ _ ⚠️`);
    }
    //Register global slash commands
    const commandPath = path.join(client.dirname, "commands")
    require('./../utils/loader/loadCommands.js').load(commandPath, client)
  },
};
