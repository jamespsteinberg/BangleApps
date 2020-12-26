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
    "hour": date.getHours(),
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
    return "Monday";
  }
  else if(normalDayOfTheWeek == 1) {
    return "Tuesday";
  }
  else if(normalDayOfTheWeek == 2) {
    return "Wednesday";
  }
  else if(normalDayOfTheWeek == 3) {
    return "Thursday";
  }
  else if(normalDayOfTheWeek == 4) {
    return "Friday";
  }
  else if(normalDayOfTheWeek == 5) {
    return "Saturday";
  }
  else if(normalDayOfTheWeek == 6) {
    return "Sunday";
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
    "hourText": addLeadingZero(date.getHours()),
    "minuteText": addLeadingZero(date.getMinutes()),
    "secondText": addLeadingZero(date.getSeconds()),
  };
  return normalDate;
}
const dayWidth = 28;
const timeWidth = 42;
const screenWidth = 239;
const weirdWeekDayHeight = 225;

function dailyHourCount(hours, minutes) {
  return hours + (minutes / 60);
}

function getWeirdDayBlockSize() {
  return ((dayWidth / timeWidth) * screenWidth);
}

function printWeirdWeekDay(dayText, percentOfDay, startingPoint) {
  g.drawRect(startingPoint - (percentOfDay * getWeirdDayBlockSize()), weirdWeekDayHeight - 10, startingPoint - (percentOfDay * getWeirdDayBlockSize()) + getWeirdDayBlockSize(), weirdWeekDayHeight + 10);
  g.drawString(dayText, startingPoint - (percentOfDay * getWeirdDayBlockSize()) + (getWeirdDayBlockSize() / 2), weirdWeekDayHeight);
}

function printWeirdWeekDays(weirdDate) {
  var percentOfDay = (dailyHourCount(weirdDate.hour, weirdDate.minute) / dayWidth);
  printWeirdWeekDay(weirdDate.dayText, percentOfDay, screenWidth / 2);
  printWeirdWeekDay(getWeirdDayName((weirdDate.day + 6 - 1) % 6), percentOfDay, screenWidth / 2 - getWeirdDayBlockSize());
  printWeirdWeekDay(getWeirdDayBlockSize((weirdDate.day + 6 + 1) % 6), percentOfDay, screenWidth / 2 + getWeirdDayBlockSize());
}

function getWeirdSleepBlockSize() {
  return ((dayWidth / timeWidth) * screenWidth);
}

function printWeirdWeekDay(dayText, percentOfDay, startingPoint) {
  g.drawRect(startingPoint - (percentOfDay * getWeirdSleepBlockSize()), weirdWeekDayHeight - 10, startingPoint - (percentOfDay * getWeirdSleepBlockSize()) + getWeirdSleepBlockSize(), weirdWeekDayHeight + 10);
  g.drawString(dayText, startingPoint - (percentOfDay * getWeirdSleepBlockSize()) + (getWeirdSleepBlockSize() / 2), weirdWeekDayHeight);
}

function printWeirdWeekDays(weirdDate) {
  var percentOfDay = (dailyHourCount(weirdDate.hour, weirdDate.minute) / dayWidth);
  printWeirdWeekDay(weirdDate.dayText, percentOfDay, screenWidth / 2);
  printWeirdWeekDay(getWeirdDayName((weirdDate.day + 6 - 1) % 6), percentOfDay, screenWidth / 2 - getWeirdSleepBlockSize());
  printWeirdWeekDay(getWeirdDayName((weirdDate.day + 6 + 1) % 6), percentOfDay, screenWidth / 2 + getWeirdSleepBlockSize());
}

function printTime() {
  var now = new Date();
  var weirdDate = normalTo28HourDate(now);
  var normalDate = getNormalDateText(now);

  var message = "\n\n \n" + normalDate.dayText + "\n " + normalDate.hourText + ":" + normalDate.minuteText + ":" + normalDate.secondText + "\n\n \n" + weirdDate.dayText + "\n " + weirdDate.hourText + ":" + weirdDate.minuteText + ":" + weirdDate.secondText;

  E.showMessage(message, "Date");
  printWeirdWeekDays(weirdDate);
}

printTime();
