const { MessageEmbed } = require("discord.js");
const Command = require("../../assets/class/Command");
const { BLUE } = require("../../assets/other/colors.json");
const { SlashCommandBuilder } = require("@discordjs/builders");

const answers = [
  "It is certain.",
  "It is decidedly so.",
  "Without a doubt.",
  "Yes - definitely.",
  "You may rely on it.",
  "As I see it, yes.",
  "Most likely.",
  "Outlook good.",
  "Yes.",
  "Yes but no",
  "Signs point to yes.",
  "Reply hazy, try again.",
  "Ask again later.",
  "Better not tell you now.",
  "Cannot predict now.",
  "Concentrate and ask again.",
  "Don't count on it.",
  "My reply is no.",
  "My sources say no.",
  "Outlook not so good.",
  "Very doubtful.",
  "XD",
];

class EightBall extends Command {
  constructor() {
    super({
      name: "eightball",
      alias: ["fortune"],
      description: "Asks the Magic 8-Ball for some psychic wisdom.",
      usage: ["8ball <question..>"],
    });
  }
  data = new SlashCommandBuilder()
    .setName("eightball")
    .setDescription("Asks the Magic 8-Ball for some psychic wisdom.")
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("Ask a question")
        .setRequired(true)
    );

  async run(interaction) {
    const question = interaction.options.getString("question");
    const embed = new MessageEmbed()
      .setTitle("🎱  The Magic 8-Ball  🎱")
      .addField("Question", question)
      .addField(
        "Answer",
        `${answers[Math.floor(Math.random() * answers.length)]}`
      )
      .setFooter(
        "Requested by " + `${interaction.member.displayName}`,
        interaction.member.avatarURL({
          dynamic: true,
          format: "png",
          size: 2048,
        })
      )
      .setTimestamp()
      .setColor(BLUE);
    await interaction.reply({ embeds: [embed] });
  }
}
module.exports = EightBall;
