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


const timeWidth = 42;
const screenWidth = 239;

const weirdDayWidth = 28;
const weirdWeekDayHeight = 230;
const weirdSleepDayHeight = 210;
const weirdAwakeHours = 19;
const weirdSleepHours = 9;

const normalDayWidth = 24;
const normalWeekDayHeight = 10;
const normalSleepDayHeight = 30;
const normalAwakeHours = 15;
const normalSleepHours = 9;



function dailyHourCount(hours, minutes) {
  return hours + (minutes / 60);
}






function getWeirdDayBlockSize() {
  return ((weirdDayWidth / timeWidth) * screenWidth);
}

function printWeirdWeekDay(dayText, percentOfBlock, startingPoint) {
  g.drawRect(startingPoint - (percentOfBlock * getWeirdDayBlockSize()), weirdWeekDayHeight - 10, startingPoint - (percentOfBlock * getWeirdDayBlockSize()) + getWeirdDayBlockSize(), weirdWeekDayHeight + 10);
  g.drawString(dayText, startingPoint - (percentOfBlock * getWeirdDayBlockSize()) + (getWeirdDayBlockSize() / 2), weirdWeekDayHeight);
}

function printWeirdWeekDays(weirdDate) {
  var percentOfBlock = dailyHourCount(weirdDate.hour, weirdDate.minute) / weirdDayWidth;
  printWeirdWeekDay(weirdDate.dayText, percentOfBlock, screenWidth / 2);
  printWeirdWeekDay(getWeirdDayName((weirdDate.day + 6 - 1) % 6), percentOfBlock, screenWidth / 2 - getWeirdDayBlockSize());
  printWeirdWeekDay(getWeirdDayName((weirdDate.day + 6 + 1) % 6), percentOfBlock, screenWidth / 2 + getWeirdDayBlockSize());
}










function printWeirdSleepDay(sleepText, blockSize, percentOfBlock, startingPoint) {
  g.drawRect(startingPoint - (percentOfBlock * blockSize), weirdSleepDayHeight - 10, startingPoint - (percentOfBlock * blockSize) + blockSize, weirdSleepDayHeight + 10);
  g.drawString(sleepText, startingPoint - (percentOfBlock * blockSize) + (blockSize / 2), weirdSleepDayHeight);
}



function printWeirdSleepDays(weirdDate) {
  var sleepInfo = getWeirdSleepInfo(weirdDate.hour);
  var percentOfBlock = sleepInfo.internalBlockTime / sleepInfo.blockWidth;
  printWeirdSleepDay(sleepInfo.text, sleepInfo.blockSize, percentOfBlock, screenWidth / 2);

  printWeirdSleepDay(sleepInfo.otherText, sleepInfo.blockSize, percentOfBlock, screenWidth / 2 - sleepInfo.blockSize);
  printWeirdSleepDay(sleepInfo.text, sleepInfo.blockSize, percentOfBlock, screenWidth / 2 - (sleepInfo.blockSize * 2));

  printWeirdSleepDay(sleepInfo.otherText, sleepInfo.blockSize, percentOfBlock, screenWidth / 2 + sleepInfo.blockSize);
  printWeirdSleepDay(sleepInfo.text, sleepInfo.blockSize, percentOfBlock, screenWidth / 2 + (sleepInfo.blockSize * 2));
}

function getWeirdSleepInfo(weirdHour) {
  var text;
  var otherText;
  var blockSize;
  var blockWidth;
  var internalBlockTime;
  if(weirdHour >= 8 || weirdHour <= 27) {
    text = "Awake";
    otherText = "Sleep";
    blockSize = (weirdDayWidth / timeWidth) * screenWidth * (weirdAwakeHours / weirdDayWidth);
    blockWidth = weirdAwakeHours;
    internalBlockTime = weirdHour - 8;
  } else {
    text = "Sleep";
    otherText = "Awake";
    blockSize = (weirdDayWidth / timeWidth) * screenWidth * (weirdSleepHours / weirdDayWidth);
    blockWidth = weirdSleepHours;
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
    "blockWidth": blockWidth,
    "internalBlockTime": internalBlockTime
  };
}










function getNormalDayBlockSize() {
  return ((normalDayWidth / timeWidth) * screenWidth);
}

function printNormalWeekDay(dayText, percentOfBlock, startingPoint) {
  g.drawRect(startingPoint - (percentOfBlock * getNormalDayBlockSize()), normalWeekDayHeight - 10, startingPoint - (percentOfBlock * getNormalDayBlockSize()) + getNormalDayBlockSize(), normalWeekDayHeight + 10);
  g.drawString(dayText, startingPoint - (percentOfBlock * getNormalDayBlockSize()) + (getNormalDayBlockSize() / 2), normalWeekDayHeight);
}

function printNormalWeekDays(normalDate) {
  var percentOfBlock = dailyHourCount(normalDate.hour, normalDate.minute) / normalDayWidth;
  printNormalWeekDay(normalDate.dayText, percentOfBlock, screenWidth / 2);
  printNormalWeekDay(getNormalDayName((normalDate.day + 7 - 1) % 7), percentOfBlock, screenWidth / 2 - getNormalDayBlockSize());
  printNormalWeekDay(getNormalDayName((normalDate.day + 7 + 1) % 7), percentOfBlock, screenWidth / 2 + getNormalDayBlockSize());
}










function printNormalSleepDay(sleepText, blockSize, percentOfBlock, startingPoint) {
  g.drawRect(startingPoint - (percentOfBlock * blockSize), normalSleepDayHeight - 10, startingPoint - (percentOfBlock * blockSize) + blockSize, normalSleepDayHeight + 10);
  g.drawString(sleepText, startingPoint - (percentOfBlock * blockSize) + (blockSize / 2), normalSleepDayHeight);
}



function printNormalSleepDays(normalDate) {
  var sleepInfo = getNormalSleepInfo(normalDate.hour);
  var percentOfBlock = sleepInfo.internalBlockTime / sleepInfo.blockWidth;
  printNormalSleepDay(sleepInfo.text, sleepInfo.blockSize, percentOfBlock, screenWidth / 2);

  printNormalSleepDay(sleepInfo.otherText, sleepInfo.blockSize, percentOfBlock, screenWidth / 2 - sleepInfo.blockSize);
  printNormalSleepDay(sleepInfo.text, sleepInfo.blockSize, percentOfBlock, screenWidth / 2 - (sleepInfo.blockSize * 2));

  printNormalSleepDay(sleepInfo.otherText, sleepInfo.blockSize, percentOfBlock, screenWidth / 2 + sleepInfo.blockSize);
  printNormalSleepDay(sleepInfo.text, sleepInfo.blockSize, percentOfBlock, screenWidth / 2 + (sleepInfo.blockSize * 2));
}

function getNormalSleepInfo(normalHour) {
  var text;
  var otherText;
  var blockSize;
  var blockWidth;
  var internalBlockTime;
  if(normalHour >= 8 || normalHour <= 23) {
    text = "Awake";
    otherText = "Sleep";
    blockSize = (normalDayWidth / timeWidth) * screenWidth * (normalAwakeHours / normalDayWidth);
    blockWidth = normalAwakeHours;
    internalBlockTime = normalHour - 8;
  } else {
    text = "Sleep";
    otherText = "Awake";
    blockSize = (normalDayWidth / timeWidth) * screenWidth * (normalSleepHours / normalDayWidth);
    blockWidth = normalSleepHours;
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
    "blockWidth": blockWidth,
    "internalBlockTime": internalBlockTime
  };
}







function printTime() {
  var now = new Date();
  var weirdDate = normalTo28HourDate(now);
  var normalDate = getNormalDateText(now);

  var message = "\n\n \n" + normalDate.dayText + "\n " + normalDate.hourText + ":" + normalDate.minuteText + ":" + normalDate.secondText + "\n\n \n" + weirdDate.dayText + "\n " + weirdDate.hourText + ":" + weirdDate.minuteText + ":" + weirdDate.secondText;

  E.showMessage(message, "");
  printWeirdWeekDays(weirdDate);
  printWeirdSleepDays(weirdDate);
  printNormalWeekDays(normalDate);
  printNormalSleepDays(normalDate);
}

printTime();
