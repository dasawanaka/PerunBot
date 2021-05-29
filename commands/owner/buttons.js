const { MessageEmbed } = require("discord.js");
const { MessageButton } = require("discord-buttons");
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
    let myembed = new MessageEmbed().setDescription(
      "Hi! This is simple button test xDD"
    );
    let btn = new MessageButton()
      .setStyle("green")
      .setLabel("💚 and text")
      .setID("click_btn"); //note: if you use the style "url" you must provide url using .setURL('https://example.com')
    //.setDisabled(); //disables the button | default: false

    let btn2 = new MessageButton()
      .setStyle("gray")
      .setLabel("🖤 and text")
      .setID("click_btn");

    let btn3 = new MessageButton()
      .setStyle("red")
      .setLabel("❤️ and text")
      .setID("click_btn");

    let btn4 = new MessageButton()
      .setStyle("blurple")
      .setLabel("💙 and text")
      .setID("click_btn");

    let btn5 = new MessageButton()
      .setStyle("url")
      .setLabel("🔗 just link")
      .setURL("https://example.com");

    let btn6 = new MessageButton()
      .setStyle("green")
      .setLabel("green")
      .setID("click_btn")
      .setDisabled();

    let btn7 = new MessageButton()
      .setStyle("gray")
      .setLabel("gray")
      .setID("click_btn")
      .setDisabled();

    let btn8 = new MessageButton()
      .setStyle("red")
      .setLabel("red")
      .setID("click_btn")
      .setDisabled();

    let btn9 = new MessageButton()
      .setStyle("blurple")
      .setLabel("💙")
      .setID("click_btn")
      .setDisabled();

    let btn10 = new MessageButton()
      .setStyle("url")
      .setLabel("link")
      .setURL("https://example.com")
      .setDisabled();

    message.channel.send({
      buttons: [btn, btn2, btn3, btn4, btn5], //, btn6, btn7, btn8, btn9, btn10
      embed: myembed,
    });
  }
}
module.exports = ButtonsTest;
