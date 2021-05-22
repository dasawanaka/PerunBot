const Discord = require("discord.js");
const pagination = require("discord.js-pagination");
const HelpGenerator = require("../../utils/HelpGenerator");

const pages = new Array();

module.exports = {
  name: "help",
  alias: ["h"],
  public: true,
  description: "I'm helping you, right?",
  cooldown: 5000,
  async run(client, message, args) {

    if(args[0]){
        return message.channel.send(await HelpGenerator.getHelp(args[0]));
    }

    if (pages.length === 0) {
      console.log("pages coint is 0");
      const pa = HelpGenerator.generateHelpEmbeds();
      pa.forEach((page) => {
        pages.push(page);
      });
    } else console.log("not empty pages");

    const emojiList = ["⏪", "⏩"];
    const timeout = "180000";
    pagination(message, pages, emojiList, timeout);
  },
};
