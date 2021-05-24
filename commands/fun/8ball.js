const { MessageEmbed } = require("discord.js");
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
];

module.exports = {
  name: "8ball",
  alias: ["fortune"],
  public: true,
  description: "Asks the Magic 8-Ball for some psychic wisdom.",
  usage: ["8ball <question..>"],
  cooldown: 5000,
  async run(client, message, args) {
    if (!args[0]) {
      message.channel.send("Please provide a question to ask");
      throw new Error("Empty question in 8ball");
    }
    if (args.join(" ").length > 250) {
      message.channel.send(
        "To long...Max question characters is 250. You need to enter the command again."
      );
      throw new Error("8ball question to long.");
    }

    const question = args.join(" ");
    const embed = new MessageEmbed()
      .setTitle("🎱  The Magic 8-Ball  🎱")
      .addField("Question", question)
      .addField(
        "Answer",
        `${answers[Math.floor(Math.random() * answers.length)]}`
      )
      .setFooter(
        message.member.displayName,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  },
};
