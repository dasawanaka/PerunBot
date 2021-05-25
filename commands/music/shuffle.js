
module.exports = {
    name: "shuffle",
    alias: ['random'],
    public: true,
    description: "Woogie Booogie!",
    usage: ["<prefix>shuffle"],
    async run(client, message, args) {  
        client.distube.shuffle(message)
        message.channel.send("Queue has been shuffled!");
    },
  };

