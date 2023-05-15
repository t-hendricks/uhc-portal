import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Select, SelectOption, DatePicker, ToolbarItem, isValidDate } from '@patternfly/react-core';

// Local timezone UTC offset
const offset = new Date().getTimezoneOffset() * 60000;

let defaultTimestamps;
const getDefaultTimestamps = (refresh = false) => {
  if (!defaultTimestamps || refresh) {
    const now = dateParse(new Date().toISOString());

    const lastMonthStart = new Date(now);
    lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);

    const lastWeekStart = new Date(now);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);

    const last72HoursStart = new Date(now);
    last72HoursStart.setDate(last72HoursStart.getDate() - 3);

    defaultTimestamps = {
      now,
      lastMonthStart,
      lastWeekStart,
      last72HoursStart,
    };
    return defaultTimestamps;
  }
  return defaultTimestamps;
};

export const getTimestampFrom = (minDate) => {
  const { lastMonthStart } = getDefaultTimestamps();

  if (minDate < lastMonthStart) {
    return lastMonthStart;
  }

  return minDate;
};

const optionValues = {
  LastMonth: 'Last month',
  LastWeek: 'Last week',
  Last72Hours: 'Last 72 hours',
  Custom: 'Custom',
};

/**
 * Returns a date in YYYY-MM-DD format
 */
export const dateFormat = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
};

const splitDateStr = (dateStr) =>
  dateStr
    .replace(/T.*/, '')
    .split('-')
    .filter((part) => part !== '' && Number.parseInt(part, 10) !== 0);

/**
 * Parses a date string that is in ISO format YYYY-MM-DD
 */
export const dateParse = (dateStr, asDate = true) => {
  const split = splitDateStr(dateStr);
  if (split.length !== 3) {
    return asDate ? new Date() : '';
  }
  const year = split[0];
  const month = split[1];
  const day = split[2];
  const paddedDateStr = `${year.padStart(4, '0')}-${month.padStart(2, '0')}-${day.padStart(
    2,
    '0',
  )}`;
  return asDate
    ? new Date(Date.UTC(year, Number.parseInt(month, 10) - 1, day) + offset)
    : paddedDateStr;
};

export const onDateChangeFromFilter = (dateStr) => ({
  date: `${dateStr}T00:00:00.000Z`,
  key: 'timestampFrom',
  symbol: '>=',
});

const onDateChangeToFilter = (dateStr) => ({
  date: `${dateStr}T23:59:59.999Z`,
  key: 'timestampTo',
  symbol: '<=',
});

const ClusterLogsDatePicker = ({ setFilter, currentFilter, createdAt }) => {
  const { now, lastMonthStart, lastWeekStart, last72HoursStart } = getDefaultTimestamps();
  const minDateStr = createdAt.replace(/T.*/, '');
  const minDate = dateParse(createdAt);

  const options = [
    { value: optionValues.LastMonth },
    { value: optionValues.LastWeek },
    { value: optionValues.Last72Hours },
    { value: optionValues.Custom },
  ];

  const [startDateStr, setStartDateStr] = useState(dateFormat(getTimestampFrom(minDate)));
  const [endDateStr, setEndDateStr] = useState(dateFormat(now));
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [selected, setSelected] = useState(options[0].value);
  // used to force re-render due to bug https://github.com/patternfly/patternfly-react/issues/7818
  const [counter, setCounter] = useState(0);

  const onDateChange = (filters) => {
    const filterObject = {
      ...currentFilter,
    };
    filters.forEach(({ key, symbol, date }) => {
      filterObject[key] = `${symbol} '${date}'`;
    });
    setFilter(filterObject);
  };

  const onDateChangeFrom = (dateStr) => {
    setStartDateStr(dateStr);
    onDateChange([onDateChangeFromFilter(dateParse(dateStr, false))]);
  };

  const onDateChangeTo = (dateStr) => {
    setEndDateStr(dateStr);
    onDateChange([onDateChangeToFilter(dateParse(dateStr, false))]);
  };

  /**
   * Validate input against min/max dates in UTC time
   * Also determines the clickable range in the picker
   */
  const rangeValidator = (date) => {
    if (date < minDate) {
      return `Min: ${minDateStr}`;
    }
    if (date > now) {
      return `Max: ${dateFormat(now)}`;
    }
    return '';
  };

  const isValid = (dateStr) => isValidDate(new Date(dateStr));

  const inputOnChange = (dateStr, date, onChange) => {
    setSelected(optionValues.Custom);
    const split = splitDateStr(dateStr);
    if (split.length !== 3) {
      return;
    }
    if (!date || rangeValidator(date)) {
      // invalid date
      return;
    }
    if (!isValid(dateStr)) {
      return;
    }
    onChange(dateStr, date);
  };

  const placeholder = 'YYYY-MM-DD';
  const commonProps = {
    className: 'cluster-log__date-picker',
    placeholder,
    invalidFormatText: `Invalid: ${placeholder}`,
    validators: [rangeValidator],
    dateFormat,
    popoverProps: {
      position: 'right',
    },
    // force rerender due to bug https://github.com/patternfly/patternfly-react/issues/7818
    key: counter,
  };

  const pickerFrom = (
    <DatePicker
      onChange={(_, dateStr, date) => inputOnChange(dateStr, date, onDateChangeFrom)}
      value={startDateStr}
      dateParse={dateParse}
      {...commonProps}
    />
  );

  const pickerTo = (
    <DatePicker
      onChange={(_, dateStr, date) => inputOnChange(dateStr, date, onDateChangeTo)}
      value={endDateStr}
      dateParse={dateParse}
      {...commonProps}
    />
  );

  /**
   * Choose the selected date if it's not less than the min date
   */
  const getSelectionStart = (selectionDate) => {
    if (selectionDate < minDate) {
      return minDate;
    }
    return selectionDate;
  };

  const onSelectorSelect = (_, selection) => {
    setSelected(selection);
    setSelectorOpen(false);
    setCounter(counter + 1);
    let newStartDate;
    switch (selection) {
      case optionValues.LastMonth:
        newStartDate = getSelectionStart(lastMonthStart);
        break;
      case optionValues.LastWeek:
        newStartDate = getSelectionStart(lastWeekStart);
        break;
      case optionValues.Last72Hours:
        newStartDate = getSelectionStart(last72HoursStart);
        break;
      default:
        // Ignore when a user selects Custom
        return;
    }
    setStartDateStr(dateFormat(newStartDate));
    setEndDateStr(dateFormat(now));
    onDateChange([
      onDateChangeFromFilter(dateFormat(newStartDate)),
      onDateChangeToFilter(dateFormat(now)),
    ]);
  };

  const dateSelector = (
    <Select
      onToggle={setSelectorOpen}
      onSelect={onSelectorSelect}
      selections={selected}
      isOpen={selectorOpen}
      aria-label="Select a date range"
      aria-labelledby="select-date-range"
    >
      {options.map((option, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <SelectOption key={index} value={option.value} isDisabled={option.isDisabled} />
      ))}
    </Select>
  );

  return (
    <>
      <ToolbarItem>{dateSelector}</ToolbarItem>
      <ToolbarItem>{pickerFrom}</ToolbarItem>
      <ToolbarItem>{pickerTo}</ToolbarItem>
    </>
  );
};

ClusterLogsDatePicker.propTypes = {
  currentFilter: PropTypes.shape({
    description: PropTypes.string,
    timestampFrom: PropTypes.string,
    timestampTo: PropTypes.string,
  }).isRequired,
  setFilter: PropTypes.func.isRequired,
  createdAt: PropTypes.string.isRequired,
};

export default ClusterLogsDatePicker;
