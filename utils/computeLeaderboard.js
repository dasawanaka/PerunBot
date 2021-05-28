/**
 * @param {string} [client] - Your Discord.CLient.
 * @param {array} [leaderboard] - The output from 'fetchLeaderboard' function.
 */

module.exports = {
  run: (client, leaderboard) => {
    if (!client) throw new TypeError("A client was not provided.");
    if (!leaderboard) throw new TypeError("A leaderboard id was not provided.");

    if (leaderboard.length < 1) return [];
    console.log(leaderboard);
    const computedArray = [];

    leaderboard.map((key) => {
      let userName;
      let discriminator;

      if (
        client.users.cache.get(key.userID) &&
        client.users.cache.get(key.userID).username
      ) {
        userName = client.users.cache.get(key.userID).username;
        discriminator = client.users.cache.get(key.userID).discriminator;
      } else if (client.users.cache.find((user) => user.id == key.userID)) {
        userName = client.users.cache.find(
          (user) => user.id == key.userID
        ).username;
        discriminator = client.users.cache.find(
          (user) => user.id == key.userID
        ).discriminator;
      } else if (client.users.fetch(key.userID)) {
        userName = client.users.fetch(key.userID).username;
        discriminator = client.users.fetch(key.userID).discriminator;
      } else {
        userName = "Unknown";
        discriminator = "0000";
      }

      computedArray.push({
        guildID: key.guildID,
        userID: key.userID,
        xp: key.xp,
        level: key.level,
        position:
          leaderboard.findIndex(
            (i) => i.guildID === key.guildID && i.userID === key.userID
          ) + 1,
        username: userName,
        discriminator: discriminator,
      });
    });

    return computedArray;
  },
};
