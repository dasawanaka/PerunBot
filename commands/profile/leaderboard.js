const Discord = require('discord.js');
const Levels = require('discord-xp');
const ComputeLeaderboard = require('../../utils/computeLeaderboard');

module.exports = {
  name: "leaderboard",
  alias: ['lb', 'board'],
  public: true,
  description: "Show serwer leaderboard",
  usage: "<prefix>leaderboard",
  permissions: [],
  cooldown: 6000,
  async run(client, message, args) {

    const rawLeaderboard = await Levels.fetchLeaderboard(message.guild.id, 10);
    if (rawLeaderboard.length < 1) return reply("Nobody's in leaderboard yet.");

    const leaderboard = ComputeLeaderboard.run(client, rawLeaderboard); 

    const lb = leaderboard.map(e => `${e.position}. ${e.username}#${e.discriminator}\nLevel: ${e.level}\nXP: ${e.xp.toLocaleString()}`);

    message.channel.send(`${lb.join("\n\n")}}`)

  }
};
