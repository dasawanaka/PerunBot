const Command = require("../../../assets/class/Command");

class Close extends Command {
  constructor() {
    super({
      name: "close",
      alias: [],
    });
  }
  async run(client, message, args) {

    

  }
}

module.exports = Close;
