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
      logger.error(`Failed to save warn: ${e.message} ${e.stack}`);
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

  static async clearWarn(userId, guildId, moderatorId, warnId) {
    if (!userId) throw new TypeError("An user id was not provided.");
    if (!guildId) throw new TypeError("A guild id was not provided.");
    if (!moderatorId) throw new TypeError("A moderator id was not provided.");
    if (!warnId) throw new TypeError("A warn id was not provided.");

    const ww = await Warn.findOne({
      userID: userId,
      guildID: guildId,
      warnID: warnId
    });

    if (!ww) return false;

    ww.cleared = true;
    ww.clearedDate = new Date();
    ww.clearedBy = moderatorId;

    await ww.save().catch((e) => {logger.error(`Failed to unwarn user: ${e.message} ${e.stack}`); return false;});

    return true;
  }

  static async fetch(userId, guildId) {
    if (!userId) throw new TypeError("An user id was not provided.");
    if (!guildId) throw new TypeError("A guild id was not provided.");

    var warns = await Warn.collection.find({ userID: userId, guildID: guildId }).limit(100);
    if((warns.count()) === 0) return false;

    const warnList = [];
    await warns.forEach(w => warnList.push(w));

    if (!warnList) return false;
    return warnList;
  }
}

module.exports = WarnManager;
