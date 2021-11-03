const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");
const Command = require("../../assets/class/Command");
const { SlashCommandBuilder } = require("@discordjs/builders");

class Poke extends Command {
  constructor() {
    super({
      name: "poke",
    });
  }
  data = new SlashCommandBuilder()
    .setName("poke")
    .setDescription("Poke user")
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
              embed: {
                color: 16734039,
                description: "❌ | You must mention someone to poke!",
              },
            },
          ],
        });
      }

      if (member.id === interaction.member.id) {
        return interaction.reply({
          embeds: [
            {
              color: 5294200,
              description: "🤦 | You can't poke yourself tfu!",
            },
          ],
        });
      }
      if (member.id == interaction.client.user.id) {
        return interaction.reply({
          embeds: [
            {
              color: 5294200,
              description:
                "🤦 | Oh, you tried to poke me but u cant hehe (hopefully)",
            },
          ],
        });
      }

      const response = await fetch("https://nekos.life/api/v2/img/poke");
      const body = await response.json();
      const embed = new MessageEmbed()
        .setAuthor(
          member.displayName +
            " just got a poked from " +
            interaction.member.displayName,
          interaction.member.displayAvatarURL({
            dynamic: true,
            format: "png",
            size: 2048,
          })
        )
        .setImage(body.url)
        .setURL(body.url)
        .setColor("RANDOM")
        .setDescription(
          member.displayName +
            " got a poke from " +
            interaction.member.displayName
        )
        .setFooter(
          "Requested by " + `${interaction.member.displayName}`,
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

module.exports = Poke;
