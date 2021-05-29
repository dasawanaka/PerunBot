const Command = require("../../assets/class/Command");

class Stop extends Command {
    constructor() {
        super({
            name: "stop",
    alias: ['s'],
    public: true,
    description: "Why did u stop in the middle?",
    usage: ["<prefix>stop"]
        })
    }
    async run(client, message, args) {  
        client.distube.stop(message);
        message.channel.send("Stopped the music!");
    }
}
module.exports = Stop;
  
  