import React from 'react';
import PropTypes from 'prop-types';
import {
  Radio, Title, FormGroup, Form, TextInput, Select, SelectOption,
} from '@patternfly/react-core';
import { OutlinedClockIcon } from '@patternfly/react-icons';
import DatePicker from 'react-datepicker';

class UpgradeTimeSelection extends React.Component {
  state = { timeSelectionOpen: false };

  modeChange = (_, event) => {
    const { onSet, timestamp } = this.props;
    if (event.target.value === 'now') {
      onSet({ type: 'now' }); // empty timestamp = now
    } else {
      let defaultTimeStamp = timestamp;
      if (!defaultTimeStamp) {
        const HOUR_IN_MS = 60 * 60 * 1000;
        defaultTimeStamp = new Date(new Date().getTime() + HOUR_IN_MS);
        defaultTimeStamp.setMinutes(0);
        defaultTimeStamp.setSeconds(0);
        defaultTimeStamp.setMilliseconds(0);
      }
      onSet({ type: 'time', timestamp: defaultTimeStamp.toISOString() });
    }
  }

  setDate = (selectedDate) => {
    const { onSet, timestamp } = this.props;
    // Take the date from the datepicker, combine it with the time in the current timestamp
    const day = selectedDate.getDate().toString().padStart(2, 0);
    // +1 in month because getMonth() thinks January is the 0th mounth
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, 0);
    const year = selectedDate.getFullYear();
    const time = timestamp.split('T')[1];
    onSet({ type: 'time', timestamp: `${year}-${month}-${day}T${time}` });
  }

  setTime = (_, selectedTime) => {
    const { onSet, timestamp } = this.props;
    // Take the time from the time picker, combine it with the date in the current timestamp
    const date = timestamp.split('T')[0];
    onSet({ type: 'time', timestamp: `${date}T${selectedTime}:00.0Z` });
    this.setState({ timeSelectionOpen: false });
  }

  render() {
    const { type, timestamp } = this.props;
    const { timeSelectionOpen } = this.state;

    const makeSelectOptions = () => {
      const ret = [];
      for (let hour = 0; hour < 24; hour += 1) {
        ['00', '15', '30', '45'].forEach((minute) => {
          const value = `${hour.toString().padStart(2, 0)}:${minute}`;
          const date = new Date(timestamp);
          date.setUTCHours(hour);
          date.setUTCMinutes(minute);
          ret.push(
            <SelectOption value={value} key={value} isDisabled={new Date() > date}>
              {value}
              {' '}
              (UTC)
            </SelectOption>,
          );
        });
      }
      return ret;
    };

    const getSelectedTime = () => {
      const date = new Date(timestamp);
      const hour = date.getUTCHours().toString().padStart(2, 0);
      const minute = date.getUTCMinutes().toString().padStart(2, 0);
      return `${hour}:${minute}`;
    };

    return (
      <Form>
        <Title size="lg" headingLevel="h3">Schedule upgrade</Title>
        <FormGroup fieldId="upgrade-schedule-now">
          <Radio
            isChecked={type === 'now'}
            name="upgrade-schedule-type"
            id="upgrade-schedule-now"
            value="now"
            label="Upgrade now (upgrade will begin within the next hour)"
            onChange={this.modeChange}
          />
        </FormGroup>
        <FormGroup fieldId="upgrade-schedule-time">
          <Radio
            isChecked={type === 'time'}
            name="upgrade-schedule-type"
            id="upgrade-schedule-time"
            value="time"
            label="Schedule a different time"
            onChange={this.modeChange}
          />
        </FormGroup>
        { type === 'time' && (
          <>
            <FormGroup fieldId="upgrade-schedule-datepicker" className="upgrade-schedule-datepicker">
              <DatePicker
                id="upgrade-schedule-datepicker"
                selected={timestamp && new Date(timestamp.split('T')[0])}
                onChange={this.setDate}
                dateFormat="yyyy-MM-dd"
                customInput={<TextInput iconVariant="calendar" />}
                minDate={new Date()}
              />
              <Select
                toggleIcon={<OutlinedClockIcon />}
                selections={getSelectedTime()}
                onSelect={this.setTime}
                onToggle={() => this.setState(state => (
                  { timeSelectionOpen: !state.timeSelectionOpen }
                ))}
                isOpen={timeSelectionOpen}
              >
                {makeSelectOptions()}
              </Select>
            </FormGroup>
            <dl className="cluster-upgrade-dl">
              <dt>Local Time</dt>
              <dd>
                {new Date(timestamp).toString()}
              </dd>
            </dl>
          </>
        )}
      </Form>
    );
  }
}

UpgradeTimeSelection.propTypes = {
  onSet: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['now', 'time']),
  timestamp: PropTypes.string,
};

export default UpgradeTimeSelection;
