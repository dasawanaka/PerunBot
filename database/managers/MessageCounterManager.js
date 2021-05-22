const CounterModel = require("../models/message_counter");

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
      .catch((e) => console.log(`Failed to create user: ${e}`));

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
    }).catch((e) => console.log(`Failed to delete user: ${e}`));

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
        .catch((e) => console.log(`Failed to save new user.`));
      return;
    }

    user.messages += messagesCount;

    await user.save().catch((e) => console.log(`Failed to append Coins: ${e}`));
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
    console.log("Fetch MessageCounter for user: " + user);
    return user;
  }
}

module.exports = MessageCounterManager;
