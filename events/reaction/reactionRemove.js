
module.exports = {
    name: "reactionRemove",
    description: "this is event for remove reaction",
    async run(client, reaction, user) {
        
        client.ReactionRoleSystem.processAddReaction(client, reaction, user);
      
    },
  };