const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");
const Command = require("../../assets/class/Command");
const { RED } = require("../../assets/other/colors.json");
const { SlashCommandBuilder } = require('@discordjs/builders');

class Baka extends Command {
  constructor() {
    super({
      name: "baka"
    });
  }
  data = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription("BAAAAAAAKA!")
    .addUserOption((option) =>
      option.setName("user").setDescription("The user")
    );

  async run(interaction) {
    const member = interaction.options.getMember("user") || interaction.member;

    try {
      const response = await fetch("https://nekos.life/api/v2/img/baka");
      const body = await response.json();
      const embed = new MessageEmbed()
        .setTitle(`BAKA! BAAKA! BAAAKA! BAAAAAAAKA!`)
        .setDescription(`:rage: ${member}, you BAAAKA!`)
        .setImage(body.url)
        .setColor("RANDOM")
        .setFooter(
          "Requested by " + `${interaction.member.displayName}`,
          interaction.member.displayAvatarURL({
            dynamic: true,
            format: "png",
            size: 2048,
          })
        )
        .setURL(body.url);
      interaction.reply({ embeds: [embed] });
    } catch (err) {
      const errEmbed = new MessageEmbed()
        .setColor(RED)
        .setDescription("Something went wrong... :cry:");
      interaction.reply({ embeds: [errEmbed] });
    }
  }
}

module.exports = Baka;
