const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");
const Command = require("../../assets/class/Command");
const { SlashCommandBuilder } = require("@discordjs/builders");

class Kiss extends Command {
  constructor() {
    super({
      name: "kiss",
    });
  }
  data = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription("Give a kiss to mention user")
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
                description: "💔 | You must mention user to kiss ;-;",
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
              description:
                "💔 | You cant kiss yourself ;-; (Try kissing someone else, your love. Maybe you need some help?)",
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
                "💔 | Oh, you tried to kiss me but u can't... Im not real... But I can kiss you ＼( ^o^ )／",
            },
          ],
        });
      }

      const response = await fetch("https://nekos.life/api/v2/img/kiss");
      const body = await response.json();
      const embed = new MessageEmbed()
        .setAuthor(
          member.displayName +
            " just got a kiss from " +
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
        .setDescription("So sweeet :3")
        .setFooter(
          "Requested by " +
            `${interaction.member.displayName}` +
            " • (this is so cute ＼( ^o^ )／)",
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

module.exports = Kiss;
