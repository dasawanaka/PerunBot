const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");
const Command = require("../../assets/class/Command");
const { RED } = require("../../assets/other/colors.json");
const { SlashCommandBuilder } = require('@discordjs/builders');

class Baka extends Command {
  constructor() {
    super({
      name: "baka",
      alias: [],
      public: true,
      description: "BAAAAAAAKA!",
      usage: ["baka [user mention]"],
    });
  }
  data = new SlashCommandBuilder()
    .setName("baka")
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
          interaction.member.avatarURL({
            dynamic: true,
            format: "gif",
            size: 2048,
          })
        )
        .setURL(body.url);
      await interaction.reply({ embeds: [embed] });
    } catch (err) {
      const errEmbed = new MessageEmbed()
        .setColor(RED)
        .setDescription("Something went wrong... :cry:");
      await interaction.reply({ embeds: [errEmbed] });
    }
  }
}

module.exports = Baka;
