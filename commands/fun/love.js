const { MessageEmbed } = require("discord.js");
const progressbar = require("percentagebar");
const Command = require("../../assets/class/Command");
const { SlashCommandBuilder } = require("@discordjs/builders");

class Love extends Command {
  constructor() {
    super({
      name: "love",
    });
  }
  data = new SlashCommandBuilder()
    .setName("love")
    .setDescription("Ship members")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to check the love level")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("user2")
        .setDescription("The second user")
        .setRequired(false)
    );
  async run(interaction) {
    try {
      const user1 = interaction.options.getMember("user");

      let user2 = interaction.options.getMember("user2");
      if (!user2) {
        user2 = interaction.member;
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
            interaction.guild.iconURL({ dynamic: true, format: "png" })
          )
          .setThumbnail(
            "https://cdn.discordapp.com/attachments/678279309961461811/846474797603880970/badhearth.jpg"
          )
          .setDescription(
            `I shipped **${user1}** with **${user2}** and it is **${ship}%**\n${bar}`
          )
          .setFooter(
            "Requested by " +
              `${interaction.member.displayName}`,
            interaction.member.displayAvatarURL({
              dynamic: true,
              format: "png",
              size: 2048,
            })
          )
          .setURL("https://www.vecteezy.com/free-vector/wallpaper")
          .setColor("RED");

        interaction.reply({ embeds: [embed] });
      } else {
        const embed = new MessageEmbed()
          .setTitle(
            ":twisted_rightwards_arrows: They are born for each others!",
            interaction.guild.iconURL({ dynamic: true, format: "png" })
          )
          .setThumbnail(
            "https://cdn.discordapp.com/attachments/678279309961461811/846476739697967114/NEON_VALENTINE.jpg"
          )
          .setDescription(
            `I shipped **${user1}** with **${user2}** and it is **${ship}%**\n${bar}`
          )
          .setFooter(
            "Requested by " +
              `${interaction.member.displayName}`,
            interaction.member.displayAvatarURL({
              dynamic: true,
              format: "png",
              size: 2048,
            })
          )
          .setURL("https://www.vecteezy.com/free-vector/neon-heart")
          .setColor("GREEN");

        interaction.reply({ embeds: [embed] });
      }
    } catch (err) {
      interaction.reply({
        embeds: [
          {
            color: 16734039,
            description: "Something went wrong... :cry:",
          },
        ],
      });
      interaction.client.logger.error(`${err.message} ${err.stack}`);
    }
  }
}

module.exports = Love;
