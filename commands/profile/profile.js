const Discord = require("discord.js");
const Canvas = require("canvas");
const Levels = require("discord-xp");
const Coins = require("../../database/managers/CoinsManager");
const Rep = require("../../database/managers/ReputationManager");
const MessageCounterManager = require("../../database/managers/MessageCounterManager");
const ComputeLeaderboard = require("../../utils/computeLeaderboard");

Canvas.registerFont("assets/fonts/nirmala-ui-bold.ttf", {
  family: "Nirmala UI",
});

module.exports = {
  name: "profile",
  alias: ["prof", "pro", "userprofile", "user", "ppc"],
  public: true,
  description: "Show user profile card",
  usage: ["<prefix>profile"],
  permissions: [],
  cooldown: 60000,
  async run(client, message, args) {
    const canvas = Canvas.createCanvas(800, 600);
    const context = canvas.getContext("2d");

    //background color/frame
    context.strokeStyle = "rgb(48, 48, 48)";
    context.fillStyle = "rgba(48, 48, 48, 1.0)";
    roundRect(context, 0, 0, canvas.width, canvas.height, 20, true, true);

    //background image
    const bgImage = await Canvas.loadImage("assets/img/pc_bg_down_2.jpg");
    context.save();
    roundRect(context, 9, 260, bgImage.width, bgImage.height, 20, false, false);
    context.strokeStyle = "rgba(48, 48, 48, 1.0)";
    context.stroke();
    context.clip();
    context.drawImage(bgImage, 9, 260, bgImage.width, bgImage.height);
    context.restore();

    //top image
    const topImage = await Canvas.loadImage("assets/img/pc_top_img.jpg");
    context.save();
    roundRect(context, 9, 9, topImage.width, topImage.height, 20, false, false);
    context.strokeStyle = "rgba(48, 48, 48, 1.0)";
    context.stroke();
    context.clip();
    context.drawImage(topImage, 9, 9, topImage.width, topImage.height);
    context.restore();

    context.fillRect(25, 172, 210, 210);

    const avatar = await Canvas.loadImage(
      message.author.displayAvatarURL({ format: "png" })
    );

    context.drawImage(avatar, 30, 177, 200, 200);

    let name = message.author.username;

    context.font = applyText(canvas, name, 65);
    context.strokeText(name, 285, 365);
    context.fillStyle = "#ffffff";
    context.fillText(name, 285, 365);

    var uLevel = await Levels.fetch(message.author.id, message.guild.id);
    let level = `${uLevel.level} lvl`;

    context.font = applyText(canvas, level, 85);
    var l = context.measureText(level).width;
    let pos = (180 - l) / 2;
    context.strokeText(level, 35 + pos, 475);
    context.fillStyle = "#ffffff";
    context.fillText(level, 35 + pos, 475);

    var uCoins = await Coins.fetch(message.author.id, message.guild.id);

    if (!uCoins) {
      uCoins = await Coins.createUser(message.author.id, message.guild.id);
    }

    var uRep = await Rep.fetch(message.author.id, message.guild.id);

    if (!uRep) {
      uRep = await Rep.createUser(message.author.id, message.guild.id);
    }

    let repText = `${uRep.rep} rep`;
    context.font = applyText(canvas, repText, 45);
    l = context.measureText(repText).width;
    pos = (180 - l) / 2;
    context.strokeText(repText, 35 + pos, 550);
    context.fillStyle = "#ffffff";
    context.fillText(repText, 35 + pos, 550);

    const hearthImage = await Canvas.loadImage("assets/img/hearthSmall.png");

    context.drawImage(
      hearthImage,
      275,
      370,
      hearthImage.width,
      hearthImage.height
    );

    context.font = applyText(canvas, "---", 45);
    context.strokeText("---", 360, 420);
    context.fillStyle = "#ffffff";
    context.fillText("---", 360, 420);

    const coinImage = await Canvas.loadImage("assets/img/coinSmall.png");

    context.drawImage(coinImage, 275, 440, coinImage.width, coinImage.height);

    context.font = applyText(canvas, uCoins.coins, 45);
    context.strokeText(uCoins.coins, 360, 495);
    context.fillStyle = "#ffffff";
    context.fillText(uCoins.coins, 360, 495);

    const trophImage = await Canvas.loadImage("assets/img/trophSmall.png");

    context.drawImage(
      trophImage,
      275,
      510,
      trophImage.width,
      trophImage.height
    );

    var position = "50+";

    let leaderboard = await Levels.fetchLeaderboard(message.guild.id, 50);
    const found = leaderboard.find((el) => el.userID === message.author.id);

    if (found != undefined) {
      var clb = ComputeLeaderboard.run(client, leaderboard);
      let e = await clb.find((el) => el.userID === message.author.id);
      position = e.position;
    }
    const posText = `#${position}`;
    context.font = applyText(canvas, posText, 45);
    context.strokeText(posText, 360, 565);
    context.fillStyle = "#ffffff";
    context.fillText(posText, 360, 565);

    const messagesCountObj = await MessageCounterManager.fetch(
      message.author.id,
      message.guild.id
    );

    const messagesCount = messagesCountObj.messages;
    const mailImage = await Canvas.loadImage("assets/img/mailSmall.png");

    context.drawImage(
      mailImage,
      490,
      515,
      mailImage.width,
      mailImage.height
    );

    context.font = applyText(canvas, messagesCount, 45, 200);
    context.strokeText(messagesCount, 590, 565);
    context.fillStyle = "#ffffff";
    context.fillText(messagesCount, 590, 565);

    const attachment = new Discord.MessageAttachment(
      canvas.toBuffer(),
      `profile-${message.author.username}.png`
    );

    message.channel.send(``, attachment);
  },
};

function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof stroke === "undefined") {
    stroke = true;
  }
  if (typeof radius === "undefined") {
    radius = 5;
  }
  if (typeof radius === "number") {
    radius = { tl: radius, tr: radius, br: radius, bl: radius };
  } else {
    var defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
    for (var side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(
    x + width,
    y + height,
    x + width - radius.br,
    y + height
  );
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();

  if (stroke) {
    ctx.stroke();
  }
  if (fill) {
    ctx.fill("evenodd");
  }
}

const applyText = (canvas, text, startSize, maxWidth) => {
  const context = canvas.getContext("2d");
  maxWidth = !maxWidth?canvas.width - 285:maxWidth;
  // Declare a base size of the font
  let fontSize = startSize;
  do {
    // Assign the font to the context and decrement it so it can be measured again
    context.font = `${(fontSize -= 5)}px "Nirmala UI"`;
    // Compare pixel width of the text to the canvas minus the approximate avatar size
  } while (context.measureText(text).width > maxWidth);

  // Return the result to use in the actual canvas
  return context.font;
};
