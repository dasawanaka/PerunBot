module.exports = {
    name: "messageReactionRemove",
    alias: [],
    public: true,
    description: "Weird faces were weird... delete them asap",
    usage: "<prefix>messagereactionremove",
    async run(client, message, args) {
        if (!message.member.hasPermission("ADMINISTRATOR"))
          return message.channel.send("You must have an ADMINISTRATOR permission!");

}
}
