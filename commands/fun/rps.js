const { MessageEmbed } = require("discord.js");
const rps = ["scissors", "rock", "paper"];
const res = ["Scissors :v:", "Rock :fist:", "Paper :raised_hand:"];

module.exports = {
  name: "rps",
  alias: [],
  public: true,
  description: "Play a game of rock–paper–scissors against Perun!",
  usage: ["rps <rock | paper | scissors>"],
  async run(client, message, args) {
    let userChoice;
    if (args.length) userChoice = args[0].toLowerCase();
    if (!rps.includes(userChoice)) {
      message.channel.send("Please enter rock, paper, or scissors");
      throw new Error("User don't want to play rps :< ");
    }
    userChoice = rps.indexOf(userChoice);
    const botChoice = Math.floor(Math.random() * 3);
    let result;
    if (userChoice === botChoice) result = "It's a draw!";
    else if (
      (botChoice === 0 && userChoice === 2) ||
      (botChoice === 1 && userChoice === 0) ||
      (botChoice === 2 && userChoice === 1)
    )
      result = "**Perun** wins!";
    else result = `**${message.member.displayName}** wins!`;
    const embed = new MessageEmbed()
      .setTitle(`${message.member.displayName} vs. Perun`)
      .addField("Your Choice:", res[userChoice], true)
      .addField("Perun's Choice", res[botChoice], true)
      .addField("Result", result, true)
      .setFooter(
        message.member.displayName,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  },
};
