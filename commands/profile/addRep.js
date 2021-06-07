const Rep = require("../../database/managers/ReputationManager");
const Discord = require("discord.js");
const Command = require("../../assets/class/Command");

class AddRep extends Command {
  constructor() {
    super({ 
      name: "rep",
  alias: [],
  public: true,
  description: "Give user a reputation point",
  usage: ["<prefix>rep <@user>"],
  permissions: [],
  cooldown: 6 * 60 * 60 * 1000
    })
  }
  async run(client, message, args) {
    const user = message.mentions.members.first();
    if (!user) {
      message.reply("An user was not provided.");
      throw new Error("An user was not provided.");
    }
    if (user.id === message.author.id) {
      message.reply("You cannot give reputation points to yourself.");
      throw new Error("Try give reputation points to yourself");
    }
    if (user.id === client.user.id) {
      message.reply("You cannot give reputation points to bot!");
      throw new Error("Try give reputation points to bot.");
    }

    const rep = await Rep.appendRep(user.id, message.guild.id, 1);

    let embed = new Discord.MessageEmbed()
      .setColor("#0099ff")
      .setTitle("Added Reputation")
      .addField("User", `${user}`, true)
      .addField("Current points", `${rep.rep}`, true)
      .addField("Added by", `${message.author.tag}`);

    message.channel.send(embed);
  }

}
module.exports = AddRep;
