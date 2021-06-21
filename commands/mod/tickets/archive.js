const Command = require("../../../assets/class/Command");
const fetchAll = require("discord-fetch-all");

class Archive extends Command {
  constructor() {
    super({
      name: "archive",
      alias: [],
    });
  }
  async run(client, message, args) {
    // First parameter needs to be a discord.js channel object
    // Second parameter is a optional set of options.
    const allMessages = await fetchAll.messages(message.channel, {
      reverseArray: true, // Reverse the returned array
      userOnly: true, // Only return messages by users
      botOnly: false, // Only return messages by bots
      pinnedOnly: false, // Only returned pinned messages
    });

    // Will return an array of all messages in the channel
    // If the channel has no messages it will return an empty array
    console.log(allMessages);
    console.log(allMessages.length);
  }
}

module.exports = Archive;
