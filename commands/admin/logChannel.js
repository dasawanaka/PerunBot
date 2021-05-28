const subcommands = new Map();
const path = require('path');

module.exports = {
  name: "logchannel",
  alias: ['lgc'],
  public: true,
  description: "Log channel commands (set | remove)",
  userPermissions: ['MANAGE_GUILD'],
  usage: ["logchannel <set | remove>"],
  cooldown: 5000,
  async init() {
    const subCommandsLoader = require("../../utils/loadSubCommands.js");
    subCommandsLoader.load(path.join(__dirname,this.name), subcommands);
  },
  async run(client, message, args) {

    let action = args.shift();

    if (!action){
      return message.channel.send({
        embed: {
          color: 16734039,
          description:
            `❌ | You must provide a action( ${Array.from(subcommands.keys()).join(' | ')} )`,
        },
      });
    }
    let command = subcommands.get(action);
    if(!command){
      return message.channel.send({
        embed: {
          color: 16734039,
          description:
            `❌ | You must provide a **VALID** action( ${Array.from(subcommands.keys()).join(' | ')} )`,
        },
      });
    }
    command.run(client, message, args);

  },
};
