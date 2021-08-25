const parseUpdateSchedule = (value) => {
  const splitted = value.split(' ');
  const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  let day = splitted[splitted.length - 1];
  if (weekdays.includes(day)) {
    day = weekdays.indexOf(day);
  }
  return [splitted[1], day];
};

export default parseUpdateSchedule;
