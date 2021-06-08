const CounterModel = require("../models/message_counter");
const logger = require("../../DefaultLogger").get();

class MessageCounterManager {
  /**
   * @param {string} [userId] - Discord user id.
   * @param {string} [guildId] - Discord guild id.
   */
  static async createUser(userId, guildId) {
    if (!userId) throw new TypeError("An user id was not provided.");
    if (!guildId) throw new TypeError("A guild id was not provided.");

    const isUser = await CounterModel.findOne({
      userID: userId,
      guildID: guildId,
    });
    if (isUser) return false;

    const newUser = new CounterModel({
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

    const user = await CounterModel.findOne({
      userID: userId,
      guildID: guildId,
    });
    if (!user) return false;

    await CounterModel.findOneAndDelete({
      userID: userId,
      guildID: guildId,
    }).catch((e) => logger.error(`Failed to delete user: ${e.message} ${e.stack}`));

    return user;
  }

  /**
   * @param {string} [userId] - Discord user id.
   * @param {string} [guildId] - Discord guild id.
   */
  static async appendOneMessage(userId, guildId) {
    return await this.appendMessages(userId, guildId, 1);
  }

  /**
   * @param {string} [userId] - Discord user id.
   * @param {string} [guildId] - Discord guild id.
   * @param {number} [coin] - Amount of coin to append.
   */
  static async appendMessages(userId, guildId, messagesCount) {
    if (!userId) throw new TypeError("An user id was not provided.");
    if (!guildId) throw new TypeError("A guild id was not provided.");
    if (!messagesCount)
      throw new TypeError("An amount of Coins was not provided.");

    const user = await CounterModel.findOne({
      userID: userId,
      guildID: guildId,
    });

    if (!user) {
      const newUser = new CounterModel({
        userID: userId,
        guildID: guildId,
        messages: messagesCount
      });

      await newUser
        .save()
        .catch((e) => logger.error(`Failed to save new user: ${e.message} ${e.stack}`));
      return;
    }

    user.messages += messagesCount;

    await user.save().catch((e) => logger.error(`Failed to append message: ${e.message} ${e.stack}`));
  }

  /**
   * @param {string} [userId] - Discord user id.
   * @param {string} [guildId] - Discord guild id.
   */

  static async fetch(userId, guildId) {
    if (!userId) throw new TypeError("An user id was not provided.");
    if (!guildId) throw new TypeError("A guild id was not provided.");

    const user = await CounterModel.findOne({
      userID: userId,
      guildID: guildId,
    });
    if (!user) return false;
    return user;
  }
}

module.exports = MessageCounterManager;
