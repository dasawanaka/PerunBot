const Levels = require("discord-xp");
const Coins = require("../database/managers/CoinsManager");
const MessageCounterManager = require("../database/managers/MessageCounterManager");
const logger = require("../DefaultLogger").get();
const EmbedGenerator = require("./EmbedGenerator");

const expCD = new Map();

module.exports = {
  async run(message) {
    MessageCounterManager.appendOneMessage(message.author.id, message.guild.id);

    if (expCD.has(`${message.author.id}_${message.guild.id}`))
      return logger.debug(
        `User ${message.author.username}(USER_ID:${message.author.id}) has cd to earn exp on guild ${message.guild.name}(ID: ${message.guild.id})`
      );
    Coins.addDailyCoin(message.author.id, message.guild.id);
    const randomXp = Math.floor(Math.random() * 10) + 5;
    const hasLeveledUp = await Levels.appendXp(
      message.author.id,
      message.guild.id,
      randomXp
    );
    if (hasLeveledUp) {
      const user = await Levels.fetch(message.author.id, message.guild.id);
      message.channel.send(
        EmbedGenerator.createSmallEmbed(
          ":pencil:",
          `Congrats ${message.author.username}! You leveled up to ${user.level}! Keep it going! \`$1000\` added to your account `
        )
      );
      Coins.appendCoins(message.author.id, message.guild.id, 1000);
      logger.debug(
        `${message.author.username} leveled up to ${user.level}! \`$1000\` added to account `
      );
    }
    expCD.set(`${message.author.id}_${message.guild.id}`, Date.now() + 60000);
    setTimeout(() => {
      expCD.delete(`${message.author.id}_${message.guild.id}`);
    }, 60000);
  },
};
