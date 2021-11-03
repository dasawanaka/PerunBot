const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");
const Command = require("../../assets/class/Command");
const { SlashCommandBuilder } = require("@discordjs/builders");

class Hug extends Command {
  constructor() {
    super({
      name: "hug"
    });
  }
  data = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription("Give a hug to mentioned user")
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
                description: "❌ | You must mention someone to hug!",
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
                "😁 | You can't hug yourself but... Ok, get the hug from me ＼( ^o^ )／ !",
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
                "😁 | Oh, you tried to hug me but u can't... Im not real... But I can hug you ＼( ^o^ )／",
            },
          ],
        });
      }

      const response = await fetch("https://nekos.life/api/v2/img/cuddle");
      const body = await response.json();
      const embed = new MessageEmbed()
        .setAuthor(
          member.displayName +
            " just got a hug from " +
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
          member.toString() +
            " got a hug from " +
            interaction.member.displayName
        )
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

module.exports = Hug;
