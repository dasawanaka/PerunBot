
module.exports = {
    name: "stop",
    alias: ['s'],
    public: true,
    description: "Why did u stop in the middle?",
    usage: "<prefix>stop",
    async run(client, message, args) {  
        client.distube.stop(message);
        message.channel.send("Stopped the music!");
    },
  };
  
  