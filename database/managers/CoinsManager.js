const CoinsModel = require("../models/coins.js");
const logger = require("../../DefaultLogger").get();

class Coins {
  /**
   * @param {string} [userId] - Discord user id.
   * @param {string} [guildId] - Discord guild id.
   */

  static async createUser(userId, guildId) {
    if (!userId) throw new TypeError("An user id was not provided.");
    if (!guildId) throw new TypeError("A guild id was not provided.");

    const isUser = await CoinsModel.findOne({
      userID: userId,
      guildID: guildId,
    });
    if (isUser) return false;

    const newUser = new CoinsModel({
      userID: userId,
      guildID: guildId,
    });

    await newUser
      .save()
      .catch((e) => logger.error(`Failed to create user: ${e.message} ${e.stack}`));

    return newUser;
  }

  /**
   * @param {string} [userId] - Discord user id.
   * @param {string} [guildId] - Discord guild id.
   */

  static async deleteUser(userId, guildId) {
    if (!userId) throw new TypeError("An user id was not provided.");
    if (!guildId) throw new TypeError("A guild id was not provided.");

    const user = await CoinsModel.findOne({ userID: userId, guildID: guildId });
    if (!user) return false;

    await CoinsModel.findOneAndDelete({
      userID: userId,
      guildID: guildId,
    }).catch((e) =>logger.error(`Failed to delete user: ${e.message} ${e.stack}`));

    return user;
  }

  /**
   * @param {string} [userId] - Discord user id.
   * @param {string} [guildId] - Discord guild id.
   * @param {number} [coin] - Amount of coin to append.
   */

  static async appendCoins(userId, guildId, coins) {
    if (!userId) throw new TypeError("An user id was not provided.");
    if (!guildId) throw new TypeError("A guild id was not provided.");
    if (!coins) throw new TypeError("An amount of Coins was not provided.");

    const user = await CoinsModel.findOne({ userID: userId, guildID: guildId });

    if (!user) {
      const newUser = new CoinsModel({
        userID: userId,
        guildID: guildId,
        coins: coins,
      });

      await newUser
        .save()
        .catch((e) => logger.error(`Failed to save new user: ${e.message} ${e.stack}`));
    }

    user.coins += coins;

    await user.save().catch((e) => logger.error(`Failed to append Coins: ${e.message} ${e.stack}`));
  }
  /**
   * @param {string} [userId] - Discord user id.
   * @param {string} [guildId] - Discord guild id.
   */

  static async addDailyCoin(userId, guildId) {
    if (!userId) throw new TypeError("An user id was not provided.");
    if (!guildId) throw new TypeError("A guild id was not provided.");

    const user = await CoinsModel.findOne({ userID: userId, guildID: guildId });

    if (!user) {
      const newUser = new CoinsModel({
        userID: userId,
        guildID: guildId,
        coins: 1,
        todayCoins: 1,
      });

      await newUser
        .save()
        .catch((e) =>  logger.error(`Failed to save new user: ${e.message} ${e.stack}`));
        user = newUser;
    }
    if(!user.lastUpdated) user.lastUpdated = new Date();
    if (this.isToday(user.lastUpdated) && user.todayCoins > 150) return;
    else if (!this.isToday(user.lastUpdated)) {
      user.lastUpdated = new Date();
      user.todayCoins = 0;
    }

    user.coins += 1;
    user.todayCoins +=1;

    await user.save().catch((e) => logger.error(`Failed to append Coins: ${e.message} ${e.stack}`));
  }

  /**
   * @param {string} [userId] - Discord user id.
   * @param {string} [guildId] - Discord guild id.
   */

  static async fetch(userId, guildId) {
    if (!userId) throw new TypeError("An user id was not provided.");
    if (!guildId) throw new TypeError("A guild id was not provided.");

    const user = await CoinsModel.findOne({ userID: userId, guildID: guildId });
    if (!user) return false;
    return user;
  }

  /**
   * @param {string} [userId] - Discord user id.
   * @param {string} [guildId] - Discord guild id.
   * @param {number} [coins] - Amount of Coins to subtract.
   */

  static async subtractCoins(userId, guildId, coins) {
    if (!userId) throw new TypeError("An user id was not provided.");
    if (!guildId) throw new TypeError("A guild id was not provided.");
    if (!coins) throw new TypeError("An amount of Coins was not provided.");

    const user = await CoinsModel.findOne({ userID: userId, guildID: guildId });
    if (!user) return false;

    user.coins -= coins;

    user.save().catch((e) => logger.error(`Failed to subtract coins: ${e.message} ${e.stack}`));

    return user;
  }
  static isToday(someDate) {
    const today = new Date();
    return (
      someDate.getDate() == today.getDate() &&
      someDate.getMonth() == today.getMonth() &&
      someDate.getFullYear() == today.getFullYear()
    );
  }
}

module.exports = Coins;
