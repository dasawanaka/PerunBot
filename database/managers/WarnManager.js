const Warn = require("../models/warn");

class WarnManager {
  /**
   * @param {string} [userId] - Discord user id.
   * @param {string} [guildId] - Discord guild id.
   */

  static async addWarn(userId, guildId, moderatorId, reason) {
    if (!userId) throw new TypeError("An user id was not provided.");
    if (!guildId) throw new TypeError("A guild id was not provided.");
    let warnCount = await Warn.count({ userID: userId, guildID: guildId });
    warnCount = !warnCount ? 0 : warnCount;
    const warn = new Warn({
      warnID: warnCount + 1,
      userID: userId,
      guildID: guildId,
      reason: reason,
      date: new Date(),
      moderator: moderatorId,
      cleared: false,
    });

    await warn.save().catch((e) => {
      console.log(`Failed to create user: ${e}`);
      return false;
    });

    let activeWarnCount = await Warn.count({
      userID: userId,
      guildID: guildId,
      cleared: false,
    });

    return activeWarnCount;
  }

  /**
   * @param {string} [userId] - Discord user id.
   * @param {string} [guildId] - Discord guild id.
   */

  static async clearWarn(userId, guildId) {
    if (!userId) throw new TypeError("An user id was not provided.");
    if (!guildId) throw new TypeError("A guild id was not provided.");
  }

  static async fetch(userId, guildId) {
    if (!userId) throw new TypeError("An user id was not provided.");
    if (!guildId) throw new TypeError("A guild id was not provided.");

    const user = await CoinsModel.findOne({ userID: userId, guildID: guildId });
    if (!user) return false;
    console.log("Fetch user: " + user);
    return user;
  }
}

module.exports = WarnManager;
