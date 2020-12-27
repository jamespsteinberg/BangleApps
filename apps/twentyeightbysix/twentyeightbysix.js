const timeWidth = 42;
const screenWidth = 239;
const screenHeight = 239;

const weirdDayWidth = 28;
const weirdWeekDayHeight = 230;
const weirdSleepDayHeight = 213;
const weirdAwakeHours = 19;
const weirdSleepHours = 9;

const normalDayWidth = 24;
const normalWeekDayHeight = 10;
const normalSleepDayHeight = 28;
const normalAwakeHours = 15;
const normalSleepHours = 9;

const backgroundColor = "#2c2e3a";
const mainTextColor = "#FFFFFF";
const watchColor = "#aaaaaa";

const sleepTextColor = "#000000";
const sleepBlockColor = "#D8D8D8";

const awakeTextColor = "#000000";
const awakeBlockColor = "#FFFFFF";

const dayTextColor = "#FFFFFF";
const dayBlockColor = "#2c2e3a";


function hoursFromWeekStart(dayOfTheWeek, todayHours) {
  var previousDayHours;
  if(dayOfTheWeek == 0) {
    previousDayHours = 6 * 24;
  }
  else {
    previousDayHours = (dayOfTheWeek - 1) * 24;
  }
  return previousDayHours + todayHours;
}

function normalTo28HourDate(date) {
  var hourCount = hoursFromWeekStart(date.getDay(), date.getHours());
  // Weird Days: 0-Tuesday to 5-Sunday
  var weirdDayOfTheWeek = Math.round((hourCount / 28) - 0.5);

  var weirdDate = {
    "dayText": getWeirdDayName(weirdDayOfTheWeek),
    "day": weirdDayOfTheWeek,
    "hourText": addLeadingZero(hourCount - (weirdDayOfTheWeek * 28)),
    "hour": hourCount - (weirdDayOfTheWeek * 28),
    "minuteText": addLeadingZero(date.getMinutes()),
    "minute": date.getMinutes(),
    "secondText": addLeadingZero(date.getSeconds()),
  };
  return weirdDate;
}

function getWeirdDayName(weirdDayOfTheWeek) {
  if(weirdDayOfTheWeek == 0) {
    return "Tuesday";
  }
  else if(weirdDayOfTheWeek == 1) {
    return "Wednesday";
  }
  else if(weirdDayOfTheWeek == 2) {
    return "Thursday";
  }
  else if(weirdDayOfTheWeek == 3) {
    return "Friday";
  }
  else if(weirdDayOfTheWeek == 4) {
    return "Saturday";
  }
  else if(weirdDayOfTheWeek == 5) {
    return "Sunday";
  }
}

function getNormalDayName(normalDayOfTheWeek) {
  if(normalDayOfTheWeek == 0) {
    return "Sunday";
  }
  else if(normalDayOfTheWeek == 1) {
    return "Monday";
  }
  else if(normalDayOfTheWeek == 2) {
    return "Tuesday";
  }
  else if(normalDayOfTheWeek == 3) {
    return "Wednesday";
  }
  else if(normalDayOfTheWeek == 4) {
    return "Thursday";
  }
  else if(normalDayOfTheWeek == 5) {
    return "Friday";
  }
  else if(normalDayOfTheWeek == 6) {
    return "Saturday";
  }
}

function addLeadingZero(number) {
  if(number < 10) {
    return "0" + number;
  }
  return "" + number;
}

function getNormalDateText(date) {
  var normalDate = {
    "dayText": getNormalDayName(date.getDay()),
    "day": date.getDay(),
    "hourText": addLeadingZero(date.getHours()),
    "hour": date.getHours(),
    "minuteText": addLeadingZero(date.getMinutes()),
    "minute": date.getMinutes(),
    "secondText": addLeadingZero(date.getSeconds()),
  };
  return normalDate;
}

function dailyHourCount(hours, minutes) {
  return hours + (minutes / 60);
}






function getWeirdDayBlockSize() {
  return ((weirdDayWidth / timeWidth) * screenWidth);
}

function printWeirdWeekDay(dayText, percentOfBlock, startingPoint) {
  g.setColor(dayBlockColor);
  g.fillRect(startingPoint - (percentOfBlock * getWeirdDayBlockSize()), weirdWeekDayHeight - 10, startingPoint - (percentOfBlock * getWeirdDayBlockSize()) + getWeirdDayBlockSize(), weirdWeekDayHeight + 10);
  g.setColor(dayTextColor);
  g.drawRect(startingPoint - (percentOfBlock * getWeirdDayBlockSize()), weirdWeekDayHeight - 10, startingPoint - (percentOfBlock * getWeirdDayBlockSize()) + getWeirdDayBlockSize(), weirdWeekDayHeight + 10);
  g.drawString(dayText, startingPoint - (percentOfBlock * getWeirdDayBlockSize()) + (getWeirdDayBlockSize() / 2), weirdWeekDayHeight);
}

function printWeirdWeekDays(weirdDate) {
  var percentOfBlock = dailyHourCount(weirdDate.hour, weirdDate.minute) / weirdDayWidth;
  printWeirdWeekDay(weirdDate.dayText, percentOfBlock, screenWidth / 2);
  printWeirdWeekDay(getWeirdDayName((weirdDate.day + 6 - 1) % 6), percentOfBlock, screenWidth / 2 - getWeirdDayBlockSize());
  printWeirdWeekDay(getWeirdDayName((weirdDate.day + 6 + 1) % 6), percentOfBlock, screenWidth / 2 + getWeirdDayBlockSize());
}




function printWeirdSleepDay(sleepText, blockSize, textColor, blockColor, startingPoint) {
  g.setColor(blockColor);
  g.fillRect(startingPoint, weirdSleepDayHeight - 7, startingPoint + blockSize, weirdSleepDayHeight + 7);
  g.setColor(textColor);
  g.drawString(sleepText, startingPoint + (blockSize / 2), weirdSleepDayHeight);
}



function printWeirdSleepDays(weirdDate) {
  var sleepInfo = getWeirdSleepInfo(weirdDate.hour);
  var percentOfBlock = sleepInfo.internalBlockTime / sleepInfo.blockWidth;
  var startingPoint = (screenWidth / 2) - (percentOfBlock * sleepInfo.blockSize);

  printWeirdSleepDay(sleepInfo.text, sleepInfo.blockSize, sleepInfo.textColor, sleepInfo.blockColor, startingPoint);

  printWeirdSleepDay(sleepInfo.otherText, sleepInfo.otherBlockSize, sleepInfo.otherTextColor, sleepInfo.otherBlockColor, startingPoint - sleepInfo.otherBlockSize);
  printWeirdSleepDay(sleepInfo.text, sleepInfo.blockSize, sleepInfo.textColor, sleepInfo.blockColor, startingPoint - sleepInfo.otherBlockSize - sleepInfo.blockSize);

  printWeirdSleepDay(sleepInfo.otherText, sleepInfo.otherBlockSize, sleepInfo.otherTextColor, sleepInfo.otherBlockColor, startingPoint + sleepInfo.blockSize);
  printWeirdSleepDay(sleepInfo.text, sleepInfo.blockSize, sleepInfo.textColor, sleepInfo.blockColor, startingPoint + sleepInfo.otherBlockSize + sleepInfo.blockSize);
}

function getWeirdSleepInfo(weirdHour) {
  var text;
  var otherText;
  var blockSize;
  var otherBlockSize;
  var blockWidth;
  var internalBlockTime;
  var textColor;
  var blockColor;
  var otherTextColor;
  var otherBlockColor;
  if(weirdHour >= 8 || weirdHour <= 27) {
    text = "Awake";
    otherText = "Sleep";
    blockSize = (weirdDayWidth / timeWidth) * screenWidth * (weirdAwakeHours / weirdDayWidth);
    otherBlockSize = (weirdDayWidth / timeWidth) * screenWidth * (weirdSleepHours / weirdDayWidth);
    blockWidth = weirdAwakeHours;
    textColor = awakeTextColor;
    blockColor = awakeBlockColor;
    otherBlockColor = sleepBlockColor;
    otherTextColor = sleepTextColor;
    internalBlockTime = weirdHour - 8;
  } else {
    text = "Sleep";
    otherText = "Awake";
    blockSize = (weirdDayWidth / timeWidth) * screenWidth * (weirdSleepHours / weirdDayWidth);
    otherBlockSize = (weirdDayWidth / timeWidth) * screenWidth * (weirdAwakeHours / weirdDayWidth);
    blockWidth = weirdSleepHours;
    textColor = sleepTextColor;
    blockColor = sleepBlockColor;
    otherBlockColor = awakeBlockColor;
    otherTextColor = awakeTextColor;
    if(weirdHour <= 8) {
      internalBlockTime = weirdHour + 1;
    } else {
      internalBlockTime = 0;
    }
  }

  return {
    "text": text,
    "otherText": otherText,
    "blockSize": blockSize,
    "otherBlockSize": otherBlockSize,
    "blockWidth": blockWidth,
    "textColor": textColor,
    "blockColor": blockColor,
    "otherBlockColor": otherBlockColor,
    "otherTextColor": otherTextColor,
    "internalBlockTime": internalBlockTime
  };
}










function getNormalDayBlockSize() {
  return ((normalDayWidth / timeWidth) * screenWidth);
}

function printNormalWeekDay(dayText, percentOfBlock, startingPoint) {
  g.setColor(dayBlockColor);
  g.fillRect(startingPoint - (percentOfBlock * getNormalDayBlockSize()), normalWeekDayHeight - 10, startingPoint - (percentOfBlock * getNormalDayBlockSize()) + getNormalDayBlockSize(), normalWeekDayHeight + 10);

  g.setColor(dayTextColor);
  g.drawRect(startingPoint - (percentOfBlock * getNormalDayBlockSize()), normalWeekDayHeight - 10, startingPoint - (percentOfBlock * getNormalDayBlockSize()) + getNormalDayBlockSize(), normalWeekDayHeight + 10);
  g.drawString(dayText, startingPoint - (percentOfBlock * getNormalDayBlockSize()) + (getNormalDayBlockSize() / 2), normalWeekDayHeight);
}

function printNormalWeekDays(normalDate) {
  var percentOfBlock = dailyHourCount(normalDate.hour, normalDate.minute) / normalDayWidth;
  printNormalWeekDay(normalDate.dayText, percentOfBlock, screenWidth / 2);
  printNormalWeekDay(getNormalDayName((normalDate.day + 7 - 1) % 7), percentOfBlock, screenWidth / 2 - getNormalDayBlockSize());
  printNormalWeekDay(getNormalDayName((normalDate.day + 7 + 1) % 7), percentOfBlock, screenWidth / 2 + getNormalDayBlockSize());
}










function printNormalSleepDay(sleepText, blockSize, textColor, blockColor, startingPoint) {
  g.setColor(blockColor);
  g.fillRect(startingPoint, normalSleepDayHeight - 8, startingPoint + blockSize, normalSleepDayHeight + 6);
  g.setColor(textColor);
  g.drawString(sleepText, startingPoint + (blockSize / 2), normalSleepDayHeight);
}




function printNormalSleepDays(normalDate) {
  var sleepInfo = getNormalSleepInfo(normalDate.hour);
  var percentOfBlock = sleepInfo.internalBlockTime / sleepInfo.blockWidth;
  var startingPoint = (screenWidth / 2) - (percentOfBlock * sleepInfo.blockSize);

  printNormalSleepDay(sleepInfo.text, sleepInfo.blockSize, sleepInfo.textColor, sleepInfo.blockColor, startingPoint);

  printNormalSleepDay(sleepInfo.otherText, sleepInfo.otherBlockSize, sleepInfo.otherTextColor, sleepInfo.otherBlockColor, startingPoint - sleepInfo.otherBlockSize);
  printNormalSleepDay(sleepInfo.text, sleepInfo.blockSize, sleepInfo.textColor, sleepInfo.blockColor, startingPoint - sleepInfo.otherBlockSize - sleepInfo.blockSize);

  printNormalSleepDay(sleepInfo.otherText, sleepInfo.otherBlockSize, sleepInfo.otherTextColor, sleepInfo.otherBlockColor, startingPoint + sleepInfo.blockSize);
  printNormalSleepDay(sleepInfo.text, sleepInfo.blockSize, sleepInfo.textColor, sleepInfo.blockColor, startingPoint + sleepInfo.otherBlockSize + sleepInfo.blockSize);
}

function getNormalSleepInfo(normalHour) {
  var text;
  var otherText;
  var blockSize;
  var otherBlockSize;
  var blockWidth;
  var internalBlockTime;
  var textColor;
  var blockColor;
  var otherTextColor;
  var otherBlockColor;
  if(normalHour >= 8 || normalHour <= 23) {
    text = "Awake";
    otherText = "Sleep";
    blockSize = (normalDayWidth / timeWidth) * screenWidth * (normalAwakeHours / normalDayWidth);
    otherBlockSize = (normalDayWidth / timeWidth) * screenWidth * (normalSleepHours / normalDayWidth);
    blockWidth = normalAwakeHours;
    internalBlockTime = normalHour - 8;
    textColor = awakeTextColor;
    blockColor = awakeBlockColor;
    otherBlockColor = sleepBlockColor;
    otherTextColor = sleepTextColor;
  } else {
    text = "Sleep";
    otherText = "Awake";
    blockSize = (normalDayWidth / timeWidth) * screenWidth * (normalSleepHours / normalDayWidth);
    otherBlockSize = (normalDayWidth / timeWidth) * screenWidth * (normalAwakeHours / normalDayWidth);
    blockWidth = normalSleepHours;
    textColor = sleepTextColor;
    blockColor = sleepBlockColor;
    otherBlockColor = awakeBlockColor;
    otherTextColor = awakeTextColor;
    if(normalHour <= 8) {
      internalBlockTime = normalHour + 1;
    } else {
      internalBlockTime = 0;
    }
  }

  return {
    "text": text,
    "otherText": otherText,
    "blockSize": blockSize,
    "otherBlockSize": otherBlockSize,
    "blockWidth": blockWidth,
    "textColor": textColor,
    "blockColor": blockColor,
    "otherBlockColor": otherBlockColor,
    "otherTextColor": otherTextColor,
    "internalBlockTime": internalBlockTime
  };
}


function drawClockPointer() {
  g.setColor(watchColor);
  var middle = screenWidth / 2;
  var circleTop = normalSleepDayHeight + 38;
  var circleBottom = weirdSleepDayHeight - 40;

  g.fillPoly([
    middle, circleBottom,
    middle - 25, circleBottom - 5,
    middle - 40, circleBottom - 16,
    middle - 10, circleBottom + 5,
    middle - 3, circleBottom + 10,
    middle, circleBottom + 15
  ]);

  g.fillPoly([
    middle, circleBottom,
    middle + 25, circleBottom - 5,
    middle + 40, circleBottom - 16,
    middle + 10, circleBottom + 5,
    middle + 3, circleBottom + 10,
    middle, circleBottom + 15
  ]);

  g.fillPoly([
    middle, circleTop,
    middle - 25, circleTop + 5,
    middle - 40, circleTop + 16,
    middle - 10, circleTop - 5,
    middle - 3, circleTop - 10,
    middle, circleTop - 15
  ]);

  var circleTopRightY = normalSleepDayHeight + 29;
  g.fillPoly([
    middle, circleTop,
    middle + 25, circleTop + 5,
    middle + 40, circleTop + 16,
    middle + 10, circleTop - 5,
    middle + 3, circleTop - 10,
    middle, circleTop - 15
  ]);

}





function printTime() {

  g.setColor(backgroundColor);
  g.fillRect(0, normalSleepDayHeight + 6, screenWidth, weirdSleepDayHeight - 6);
  g.setColor(watchColor);
  g.drawCircle(screenWidth / 2, screenHeight / 2, 55);
  g.drawCircle(screenWidth / 2, screenHeight / 2, 54);
  g.drawCircle(screenWidth / 2, screenHeight / 2, 53);

  drawClockPointer();

  var now = new Date();
  var weirdDate = normalTo28HourDate(now);
  var normalDate = getNormalDateText(now);

  var normalTime = normalDate.hourText + ":" + normalDate.minuteText;
  var weirdTime = weirdDate.hourText + ":" + weirdDate.minuteText;

  g.setFontAlign(0, 0, 0);
  g.setColor(mainTextColor);

  g.setFont("Vector", 38);
  g.drawString(weirdTime, screenWidth / 2 + 3,  screenHeight / 2);

  g.setFont("6x8", 2);
  g.drawString(normalTime, screenWidth / 2 + 3, 84);

  g.drawString("Work", screenWidth / 2 + 3, normalSleepDayHeight + 18);
  g.drawString("Meal", screenWidth / 2 + 3, weirdSleepDayHeight - 18);

  printWeirdWeekDays(weirdDate);
  printNormalWeekDays(normalDate);

  g.setColor(sleepTextColor);
  g.setFont("6x8", 1);
  printWeirdSleepDays(weirdDate);
  printNormalSleepDays(normalDate);
}

printTime();

var secondInterval = setInterval(printTime, 1000);
// Stop updates when LCD is off, restart when on
Bangle.on('lcdPower',on=>{
  if (secondInterval) clearInterval(secondInterval);
  secondInterval = undefined;
  if (on) {
    secondInterval = setInterval(draw, 1000);
    printTime(); // draw immediately
  }
});


Bangle.loadWidgets();
Bangle.drawWidgets();
// Show launcher when middle button pressed
setWatch(Bangle.showLauncher, BTN2, { repeat: false, edge: "falling" }); 
