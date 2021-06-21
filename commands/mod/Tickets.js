const Command = require("../../assets/class/Command");
const path = require("path");

class Tickets extends Command {
  constructor() {
    super({
      name: "tickets",
      alias: [],
      public: false,
      description: "",
      dev: true,
    })
    let dirPath = path.join(__dirname, this.name);
     this.init(dirPath);
  }
}

module.exports = Tickets;
