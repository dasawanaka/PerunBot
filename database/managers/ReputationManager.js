const reps = require("../models/rep.js");
const logger = require("../../DefaultLogger").get();

class Reputation {

  /**
  * @param {string} [userId] - Discord user id.
  * @param {string} [guildId] - Discord guild id.
  */

  static async createUser(userId, guildId) {
    if (!userId) throw new TypeError("An user id was not provided.");
    if (!guildId) throw new TypeError("A guild id was not provided.");

    const isUser = await reps.findOne({ userID: userId, guildID: guildId });
    if (isUser) return false;

    const newUser = new reps({
      userID: userId,
      guildID: guildId
    });

    await newUser.save().catch(e => logger.error(`Failed to create user: ${e.message} ${e.stack}`));

    return newUser;
  }

  /**
  * @param {string} [userId] - Discord user id.
  * @param {string} [guildId] - Discord guild id.
  */

  static async deleteUser(userId, guildId) {
    if (!userId) throw new TypeError("An user id was not provided.");
    if (!guildId) throw new TypeError("A guild id was not provided.");

    const user = await reps.findOne({ userID: userId, guildID: guildId });
    if (!user) return false;

    await reps.findOneAndDelete({ userID: userId, guildID: guildId }).catch(e => logger.error(`Failed to delete user: ${e.message} ${e.stack}`));

    return user;
  }

  /**
  * @param {string} [userId] - Discord user id.
  * @param {string} [guildId] - Discord guild id.
  * @param {number} [rep] - Amount of coin to append.
  */

  static async appendRep(userId, guildId, rep) {
    if (!userId) throw new TypeError("An user id was not provided.");
    if (!guildId) throw new TypeError("A guild id was not provided.");
    if (!rep) throw new TypeError("An amount of rep was not provided.");

    const user = await reps.findOne({ userID: userId, guildID: guildId });

    if (!user) {
      const newUser = new reps({
        userID: userId,
        guildID: guildId,
        rep: rep
      });

      await newUser.save().catch(e => logger.error(`Failed to create user: ${e.message} ${e.stack}`));
      return newUser;
    };

    user.rep += rep;

    await user.save().catch(e => logger.error(`Failed to append rep: ${e.message} ${e.stack}`) );

    return user;
  }

  /**
  * @param {string} [userId] - Discord user id.
  * @param {string} [guildId] - Discord guild id.
  */
  static async fetch(userId, guildId) {
    if (!userId) throw new TypeError("An user id was not provided.");
    if (!guildId) throw new TypeError("A guild id was not provided.");

    const user = await reps.findOne({ userID: userId, guildID: guildId });
    if (!user) return false;
    return user;
  }

}

module.exports = Reputation;
