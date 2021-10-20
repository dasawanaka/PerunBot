module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    client.logger.info(`Ready! Bot started now! Logged in as ${client.user.tag}`);
    for (let index = 0; index < 10; index++) {
      client.logger.debug(`⚠️ _ _ APP ON DEV MODE _ _ ⚠️`);
    }
  },
};
