/**
 * @param {string} [client] - Your Discord.CLient.
 * @param {array} [leaderboard] - The output from 'fetchLeaderboard' function.
 */

module.exports = {
  run: (client, leaderboard) => {
    if (!client) throw new TypeError("A client was not provided.");
    if (!leaderboard) throw new TypeError("A leaderboard id was not provided.");

    if (leaderboard.length < 1) return [];

    const computedArray = [];

    leaderboard.map((key) =>
      computedArray.push({
        guildID: key.guildID,
        userID: key.userID,
        xp: key.xp,
        level: key.level,
        position:
          leaderboard.findIndex(
            (i) => i.guildID === key.guildID && i.userID === key.userID
          ) + 1,
        username: client.users.cache.get(key.userID)
          ? client.users.cache.get(key.userID).username 
          ? client.users.cache.get(key.userID).username 
          : client.users.find(user => user.id == key.userID).username
          : "Unknown",
        discriminator: client.users.cache.get(key.userID)
          ? client.users.cache.get(key.userID).discriminator
          ? client.users.cache.get(key.userID).discriminator
          : client.users.find(user => user.id == key.userID).discriminator
          : "0000",
      })
    );

    return computedArray;
  },
};
