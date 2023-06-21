// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: green; icon-glyph: magic;

const languages = {
  en: {
    // English
    headerText: "Real-time On-chain GAS",
    btc: "BTC",
    eth: "ETH",
  },
  fr: {
    // French
    headerText: "GAS en temps réel sur la chaîne",
    btc: "BTC",
    eth: "ETH",
  },
  zh: {
    // Simplified Chinese
    headerText: "实时链上GAS",
    btc: "BTC",
    eth: "ETH",
  },
};


//获取语言设置
var lang = Device.language().split("-")[0]
console.log("lang")
console.log(lang)

if (!languages[lang]) { // fall back to English if the user's language is not supported
  lang = "en";
}

const params = args.widgetParameter ? args.widgetParameter.split(",") : [];

const isDarkTheme = params?.[0] === "dark";
const padding = 2;

const widget = new ListWidget();
if (isDarkTheme) {
  widget.backgroundColor = new Color("#1C1C1E");
}
widget.setPadding(padding, padding, padding, padding);

widget.url = "https://twitter.com/panghu960";

const headerStack = widget.addStack();
headerStack.setPadding(0, 0, 25, 0);
const headerText = headerStack.addText(languages[lang].headerText);
headerText.font = Font.mediumSystemFont(16);
if (isDarkTheme) {
  headerText.textColor = new Color("#FFFFFF");
}

async function buildWidget() {
  const url = `http://170.178.197.3:5000/get-aggregated-data`;
  const req = new Request(url);
  const apiResult = await req.loadJSON();

  const rubicImage = await loadImage(
    "https://assets.rubic.exchange/assets/ethereum/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599/logo.png"
  );
  const ethereumImage = await loadImage(
    "https://rubic.exchange/assets/images/widget/ethereum.png"
  );
  console.log(apiResult.data.data2.data[0]);
  const btcGAS = apiResult.data.data3.economyFee;
  const ethGAS = apiResult.data.data2.data[0].standardGasPrice;

  addCrypto(rubicImage, languages[lang].btc, `${roundFun(btcGAS, 2)} sat/vB`);
  addCrypto(ethereumImage, languages[lang].eth, `${roundFun(ethGAS, 1)} Gwei`);
}

function addCrypto(image, symbol, price, grow) {
  const rowStack = widget.addStack();
  rowStack.setPadding(0, 0, 20, 0);
  rowStack.layoutHorizontally();

  const imageStack = rowStack.addStack();
  const symbolStack = rowStack.addStack();
  const priceStack = rowStack.addStack();

  imageStack.setPadding(0, 0, 0, 10);
  symbolStack.setPadding(0, 0, 0, 8);

  const imageNode = imageStack.addImage(image);
  imageNode.imageSize = new Size(20, 20);
  imageNode.leftAlignImage();

  const symbolText = symbolStack.addText(symbol);
  symbolText.font = Font.mediumSystemFont(16);

  const priceText = priceStack.addText(price);
  priceText.font = Font.mediumSystemFont(16);

  if (isDarkTheme) {
    symbolText.textColor = new Color("#FFFFFF");
  }

  // if (grow) {
  //   priceText.textColor = new Color("#4AA956");
  // } else {
  //   priceText.textColor = new Color("#D22E2E");
  // }
}

function roundFun(value, n) {
  return Math.round(value * Math.pow(10, n)) / Math.pow(10, n);
}

async function loadImage(imgUrl) {
  const req = new Request(imgUrl);
  return await req.loadImage();
}

await buildWidget();

Script.setWidget(widget);
Script.complete();
widget.presentSmall();
