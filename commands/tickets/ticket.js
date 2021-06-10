const Command = require("../../assets/class/Command");

class Ticket extends Command {
  constructor() {
    super({
      name: "ticket",
  alias: [],
  public: false,
  description: ""
    })
  }
  async run(client, message, args) {
    
  }
}

module.exports = Ticket;
