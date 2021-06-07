const { MessageEmbed } = require("discord.js");
const { MessageButton, MessageActionRow } = require("discord-buttons");
const Command = require("../../assets/class/Command");

class ButtonsTest extends Command {
  constructor() {
    super({
      name: "buttons",
      alias: [],
      public: false,
      description: "Display buttons",
      usage: ["buttons"],
    });
  }
  async run(client, message, args) {
    let myEmbed = new MessageEmbed().setDescription(
      "Hi! This is simple button test xDD"
    );
    let btn = new MessageButton()
      .setStyle("green")
      .setLabel("💚 and text")
      .setID("test"); //note: if you use the style "url" you must provide url using .setURL('https://example.com')
    //.setDisabled(); //disables the button | default: false

    let btn2 = new MessageButton()
      .setStyle("gray")
      .setLabel("🖤 and text")
      .setID("test");

    let btn3 = new MessageButton()
      .setStyle("red")
      .setLabel("❤️ and text")
      .setID("test");

    let btn4 = new MessageButton()
      .setStyle("blurple")
      .setLabel("💙 and text")
      .setID("test");

    let btn5 = new MessageButton()
      .setStyle("url")
      .setLabel("🔗 just link")
      .setURL("https://example.com");

    let btn6 = new MessageButton()
      .setStyle("green")
      .setLabel("💚 and text disabled")
      .setID("test")
      .setDisabled();

    let btn7 = new MessageButton()
      .setStyle("gray")
      .setLabel("🖤 and text disabled")
      .setID("test")
      .setDisabled();

    let btn8 = new MessageButton()
      .setStyle("red")
      .setLabel("❤️ and text disabled")
      .setID("test")
      .setDisabled();

    let btn9 = new MessageButton()
      .setStyle("blurple")
      .setLabel("💙 and text disabled")
      .setID("test")
      .setDisabled();

    let btn10 = new MessageButton()
      .setStyle("url")
      .setLabel("🔗 disabled link")
      .setURL("https://example.com")
      .setDisabled();
    let btn11 = new MessageButton()
      .setStyle("blurple")
      .setLabel("I like")
      .setEmoji("🍕")
      .setID("test");
    let btn12 = new MessageButton()
      .setStyle("red")
      .setLabel("I like")
      .setEmoji("🍏")
      .setID("test");
    let btn13 = new MessageButton()
      .setStyle("green")
      .setLabel("I like")
      .setEmoji("🍎")
      .setID("test");
      let btn14 = new MessageButton()
      .setStyle("blurple")
      .setEmoji("🍕")
      .setID("test");
    let btn15 = new MessageButton()
      .setStyle("red")
      .setEmoji("🍏")
      .setID("test");
    let btn16 = new MessageButton()
      .setStyle("green")
      .setEmoji("🍎")
      .setID("test");
    let line1 = new MessageActionRow().addComponents([
      btn,
      btn2,
      btn3,
      btn4,
      btn5,
    ]);
    let line2 = new MessageActionRow().addComponents([
      btn6,
      btn7,
      btn8,
      btn9,
      btn10,
    ]);
    let line3 = new MessageActionRow().addComponents([btn11, btn12, btn13, btn12, btn13]);
    let line4 = new MessageActionRow().addComponents([btn14, btn15, btn16, btn15, btn16]);
    message.channel
      .send({
        components: [line1, line2, line3, line4], //, btn6, btn7, btn8, btn9, btn10
        embed: myEmbed,
      })
      .catch(console.error);
  }
}
module.exports = ButtonsTest;
