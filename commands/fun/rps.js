const { MessageEmbed } = require("discord.js");
const rps = ["scissors", "rock", "paper"];
const res = ["Scissors :v:", "Rock :fist:", "Paper :raised_hand:"];

const Command = require("../../assets/class/Command");
const { SlashCommandBuilder } = require("@discordjs/builders");

class RPS extends Command {
  constructor() {
    super({
      name: "rps",
    });
  }
  data = new SlashCommandBuilder()
    .setName("rps")
    .setDescription("Play a game of rock–paper–scissors against me!")
    .addStringOption((option) =>
      option
        .setName("choice")
        .setDescription("rock / paper / scissors")
        .setRequired(true)
        .addChoice("Rock", "rock")
        .addChoice("Paper", "paper")
        .addChoice("Scissors", "scissors")
    );

  async run(interaction) {
    let userChoice = interaction.options.getString("choice");
    userChoice = rps.indexOf(userChoice);
    const botChoice = Math.floor(Math.random() * 3);
    let result;
    if (userChoice === botChoice) result = "It's a draw!";
    else if (
      (botChoice === 0 && userChoice === 2) ||
      (botChoice === 1 && userChoice === 0) ||
      (botChoice === 2 && userChoice === 1)
    )
      result = `**${interaction.guild.me.displayName}** wins!`;
    else result = `**${interaction.member.displayName}** wins!`;
    const embed = new MessageEmbed()
      .setTitle(`${interaction.member.displayName} vs. ${interaction.guild.me.displayName}`)
      .addField("Your Choice:", res[userChoice], true)
      .addField("My Choice", res[botChoice], true)
      .addField("Result", result, true)
      .setFooter(
        "Requested by " + `${interaction.member.displayName}`,
        interaction.member.displayAvatarURL({
          dynamic: true,
          format: "png",
          size: 2048,
        })
      )
      .setTimestamp()
      .setColor("RANDOM");
    interaction.reply({ embeds: [embed] });
  }
}

module.exports = RPS;
