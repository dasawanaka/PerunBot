const getRedirects = require("get-redirects");

(async () => {
  //var s1 = await getRedirects("https://google.com")
  //=> ['https://www.google.com/']
  //var s2 = await getRedirects("http://richienb.github.io")
  //=> ['http://www.richie-bendall.ml/', 'https://www.richie-bendall.ml/']
  //var s3 = await getRedirects("https://www.youtube.com/channel/UCSJ4gkVC6NrvII8umztf0Ow/live")
  //console.log(s1)
  //console.log(s2)
  //console.log(s3)
})();

//----------------------------------------------------------------

const getMetaData = require("metadata-scraper");
const ytScraper = require("yt-scraper");

const url = "https://www.youtube.com/channel/UCSJ4gkVC6NrvII8umztf0Ow/live";
const url2 = "https://www.youtube.com/user/niqhtFox/live";

getMetaData(url).then((data) => {
  //console.log(data)
  if (data.type != "profile") {
    //    ytScraper.videoInfo(data.url).then(datas => {
    //     console.log(datas)
    //   })
    getMetaData(data.url).then((data2) => {
      console.log(data2);
    });
  }
});

//------------------------------------------------------
//https://discord.com/channels/406251997180985357/776141883675377664/868428862684549150
//https://discord.com/channels/{serverID}/{channelID}/{messageID}
var text = "https://discord.com/channels/406251997180985357/776141883675377664/868428862684549150";
var linkString = text.split("/");
console.log(linkString);
console.log(linkString[linkString.length - 1]);
console.log(linkString[linkString.length - 2]);
console.log(linkString[linkString.length - 3]);
