const Discord = require("discord.js");
const Command = require("../../assets/class/Command");

class Ping extends Command {
  constructor() {
    super({
      name: "ping",
      alias: ["pp", "pingpong"],
      public: true,
      description: "Ping command, return api ping",
      usage: ["<prefix>ping"],
      cooldown: 10000,
    });
  }
  async run(client, message, args) {
    var ping = client.ws.ping;
    var embed = new Discord.MessageEmbed()
      .setColor("#0099ff")
      .setTitle("🏓 Pong!")
      .addFields(
        { name: "Api Ping", value: `${ping} ms`, inline: true },
        { name: "Server name", value: `${message.guild.name}`, inline: true }
      )
      .setTimestamp()
      .setFooter(client.user.username, client.user.avatarURL());

    message.channel.send(embed);
  }
}
module.exports = Ping;
