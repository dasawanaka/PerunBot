module.exports = {
  name: "play",
  alias: ["p"],
  public: true,
  description: "Wanna some bangarang?",
  usage: "<prefix>play [url]",
  async run(client, message, args) {
    client.distube.play(message, args.join(" "));
  },
};
