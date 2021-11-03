const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");
const Command = require("../../assets/class/Command");
const { SlashCommandBuilder } = require("@discordjs/builders");

class Tickle extends Command {
  constructor() {
    super({
      name: "tickle",
    });
  }
  data = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription("Tickle a user")
    .addUserOption((option) =>
      option.setName("user").setDescription("The user").setRequired(true)
    );
  async run(interaction) {
    try {
      const member = interaction.options.getMember("user");

      if (!member) {
        return interaction.reply({
          embeds: [
            {
              color: 16734039,
              description: "❌ | Mention a valid member of this server!",
            },
          ],
        });
      }

      if (member.id === interaction.member.id) {
        return interaction.reply({
          embeds: [
            {
              color: 5294200,
              description: "❌ | You cant tickle yourself! BAKA!",
            },
          ],
        });
      }

      const response = await fetch("https://nekos.life/api/v2/img/tickle");
      const body = await response.json();
      const embed = new MessageEmbed()
        .setAuthor(
          member.displayName +
            " just got a tickled by " +
            interaction.member.displayName,
          interaction.member.displayAvatarURL({
            dynamic: true,
            format: "png",
            size: 2048,
          })
        )
        .setImage(body.url)
        .setColor("RANDOM")
        .setFooter(
          "._. | Requested by " + `${interaction.member.displayName}`,
          interaction.member.displayAvatarURL({
            dynamic: true,
            format: "png",
            size: 2048,
          })
        )
        .setTimestamp()
        .setURL(body.url);
      interaction.reply({ embeds: [embed] });
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

module.exports = Tickle;
