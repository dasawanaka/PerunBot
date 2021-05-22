/* 
   Permissions Doc List:
   https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS
   https://discord.com/developers/docs/topics/permissions
*/

module.exports = {
  name: "commandName",
  alias: ["commandAlias1", "commandAlias2"],
  public: true,
  description: "Command description",
  usage: [
    "<prefix>commandName <arg1> [arg2]",
    "-<arg1> required arg",
    "-[arg2] - optional arg",
  ],
  examples: ["$commandName Hey John"],

  clientPermissions: [],
  userPermissions: [],
  cooldown: 10000,
  async run(client, message, args) {
    //function body
  },
};
