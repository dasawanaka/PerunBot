const { MessageEmbed } = require("discord.js");
const Command = require("../../assets/class/Command");
const { ORANGE } = require("../../assets/other/colors.json");
const { SlashCommandBuilder } = require("@discordjs/builders");

class CoinFlip extends Command {
  constructor() {
    super({
      name: "coinflip",
      description: "Flips a coin.",
    });
  }

  data = new SlashCommandBuilder()
    .setName("coinflip")
    .setDescription("Flips a coin.");

  async run(interaction) {
    const n = Math.floor(Math.random() * 2);
    let result;
    if (n === 1) result = "heads";
    else result = "tails";
    const embed = new MessageEmbed()
      .setTitle("½  Coinflip  ½")
      .setDescription(
        `I flipped a coin for you, ${interaction.member}. It was **${result}**!`
      )
      .setFooter(
        "Requested by " + `${interaction.member.displayName}`,
        await interaction.member.avatarURL({
          dynamic: true,
          format: "png",
          size: 2048,
        })
      )
      .setTimestamp()
      .setColor(ORANGE);

      interaction.reply({ embeds: [embed] });
  }
}

module.exports = CoinFlip;
