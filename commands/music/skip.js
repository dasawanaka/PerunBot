
module.exports = {
    name: "skip",
    alias: ['fs'],
    public: true,
    description: "Skipping? That was the best part!",
    usage: ["<prefix>skip"],
    async run(client, message, args) {  
        client.distube.skip(message);
            },
  };
  
  