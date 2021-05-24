const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");
const progressbar = require("percentagebar");

module.exports = {
  name: "ship",
  alias: ["love"],
  public: true,
  description: "Ship members",
  usage: ["ship <user mention/ID> [user]"],
  examples: ["ship @nurionis"],
  async run(client, message, args) {
    try {
      const user1 = args[0];

      if (!user1) {
        return message.channel.send({
          embed: {
            color: 16734039,
            description: "❌ | You must mention a user to ship!",
          },
        });
      }
      let user2 = args[1];
      if (!user2) {
        user2 = message.author;
      }
      const ship = Math.floor(Math.random() * 100) + 1;
      const bar = progressbar(
        100,
        ship,
        10,
        ":red_square:",
        ":white_large_square:",
        "💔 ",
        " ❤️",
        false
      );

      if (ship <= 50) {
        const embed = new MessageEmbed()
          .setTitle(
            ":twisted_rightwards_arrows: This isn't a match",
            message.guild.iconURL({ dynamic: true, format: "png" })
          )
          .setThumbnail(
            "https://cdn.discordapp.com/attachments/678279309961461811/846474797603880970/badhearth.jpg"
          )
          .setDescription(
            `I shipped **${user1}** with **${user2}** and it is **${ship}%**\n${bar}`
          )
          .setFooter(
            "Requested by " + `${message.author.username}`,
            message.author.displayAvatarURL({
              dynamic: true,
              format: "png",
              size: 2048,
            })
          )
          .setURL("https://www.vecteezy.com/free-vector/wallpaper")
          .setColor("RED");

        message.channel.send(embed);
      } else {
        const embed = new MessageEmbed()
          .setTitle(
            ":twisted_rightwards_arrows: They are born for each others!",
            message.guild.iconURL({ dynamic: true, format: "png" })
          )
          .setThumbnail(
            "https://cdn.discordapp.com/attachments/678279309961461811/846476739697967114/NEON_VALENTINE.jpg"
          )
          .setDescription(
            `I shipped **${user1}** with **${user2}** and it is **${ship}%**\n${bar}`
          )
          .setFooter(
            "Requested by " + `${message.author.username}`,
            message.author.displayAvatarURL({
              dynamic: true,
              format: "png",
              size: 2048,
            })
          )
          .setURL("https://www.vecteezy.com/free-vector/neon-heart")
          .setColor("GREEN");

        message.channel.send(embed);
      }
    } catch (err) {
      message.channel.send({
        embed: {
          color: 16734039,
          description: "Something went wrong... :cry:",
        },
      });
      console.log(err);
    }
  },
};
