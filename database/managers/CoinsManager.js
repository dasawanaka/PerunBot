const CoinsModel = require("../models/coins.js");

class Coins {

  /**
  * @param {string} [userId] - Discord user id.
  * @param {string} [guildId] - Discord guild id.
  */

  static async createUser(userId, guildId) {
    if (!userId) throw new TypeError("An user id was not provided.");
    if (!guildId) throw new TypeError("A guild id was not provided.");

    const isUser = await CoinsModel.findOne({ userID: userId, guildID: guildId });
    if (isUser) return false;

    const newUser = new CoinsModel({
      userID: userId,
      guildID: guildId
    });

    await newUser.save().catch(e => console.log(`Failed to create user: ${e}`));

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

    await CoinsModel.findOneAndDelete({ userID: userId, guildID: guildId }).catch(e => console.log(`Failed to delete user: ${e}`));

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
        coins: coins
      });

      await newUser.save().catch(e => console.log(`Failed to save new user.`));

    };

    user.coins += coins;

    await user.save().catch(e => console.log(`Failed to append Coins: ${e}`) );

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
    console.log("Fetch user: " + user)
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
   
    user.save().catch(e => console.log(`Failed to subtract coins: ${e}`) );

    return user;
  }

}

module.exports = Coins;