// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: pink; icon-glyph: magic;
const params = args.widgetParameter ? args.widgetParameter.split(",") : [];
const isDarkTheme = params?.[0] === "dark";
const padding = 16;
const paddingLeft = 20;

const widget = new ListWidget();
if (isDarkTheme) {
  widget.backgroundColor = new Color("#1C1C1E");
}
widget.setPadding(padding, padding, padding, paddingLeft);

function roundFun(value, n) {
  return Math.round(value * Math.pow(10, n)) / Math.pow(10, n);
}

function convertDateTimeFormat(dateTimeString) {
  const now = new Date();
  const lastUpdateDate = new Date(dateTimeString.replace(' ', 'T'));

  const timeDifference = Math.abs(now.getTime() - lastUpdateDate.getTime());
  const timeDifferenceInHours = Math.floor(timeDifference / (1000 * 3600));

  if (timeDifferenceInHours < 24) {
    return `今天 ${lastUpdateDate.getHours()}点${lastUpdateDate.getMinutes()}分`;
  } else if (timeDifferenceInHours < 48) {
    return `昨天 ${lastUpdateDate.getHours()}点${lastUpdateDate.getMinutes()}分`;
  } else {
    return `${lastUpdateDate.getMonth() + 1}月${lastUpdateDate.getDate()}日 ${lastUpdateDate.getHours()}点${lastUpdateDate.getMinutes()}分`;
  }
}

async function buildWidget() {
  const url = "http://170.178.197.3:5000/get-aggregated-data";
  const req = new Request(url);
  const apiResult = await req.loadJSON();

  // The text that will appear on the widget
  const ahr999Value = apiResult.data.data1.ahr999;
  let investmentAdvice = '';

  if (ahr999Value < 0.45) {
    investmentAdvice = '可以抄底';
  } else if (ahr999Value >= 0.45 && ahr999Value <= 1.2) {
    investmentAdvice = '适合定投';
  } else if (ahr999Value > 1.2) {
    investmentAdvice = '不适合操作';
  }

  const ahr999LabelElement = widget.addText("AHR999指数：");
  ahr999LabelElement.font = Font.boldSystemFont(15);  // Set the font to bold and size to 15

  widget.addSpacer(10);  // Add space between lines

  const ahr999ValueElement = widget.addText(`${roundFun(ahr999Value, 2)}`);
  ahr999ValueElement.font = Font.boldSystemFont(53);  // Set the font to bold and size to 55

  widget.addSpacer(10);  // Add space between lines

  const adviceText = `建议：${investmentAdvice}`;
  const adviceTextElement = widget.addText(adviceText);
  adviceTextElement.font = Font.boldSystemFont(15);  // Set the font to bold and size to 15

  widget.addSpacer(10);  // Add space between lines

  // Create the updateTimeTextElement
const lastUpdateTime = `🕒 ${convertDateTimeFormat(apiResult.last_update)}`;
const updateTimeTextElement = widget.addText(lastUpdateTime);
updateTimeTextElement.font = Font.boldSystemFont(12);  // Set the font to bold and size to 12
updateTimeTextElement.textColor = new Color("#888888");  // Set the text color to grey

  if (isDarkTheme) {
    ahr999LabelElement.textColor = new Color("#FFFFFF");
    ahr999ValueElement.textColor = new Color("#FFFFFF");
    adviceTextElement.textColor = new Color("#FFFFFF");
    updateTimeTextElement.textColor = new Color("#888888");  // Set the text color to grey
  }
}

await buildWidget();

Script.setWidget(widget);
Script.complete();
widget.presentSmall();
