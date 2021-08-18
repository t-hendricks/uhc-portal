import React from 'react';
import PropTypes from 'prop-types';
import {
  Select, SelectOption, FormGroup, Grid, GridItem, Button,
} from '@patternfly/react-core';

const VALID_SCHEDULE_REGEX = /00? [0-9][0-9]? \* \* ([0-6]|SUN|MON|TUE|WED|THU|FRI|SAT)/i;

class UpgradeScheduleSelection extends React.Component {
  state = {
    daySelectOpen: false,
    timeSelectOpen: false,
  }

  toggleDaySelect = (isOpen) => {
    this.setState({ daySelectOpen: isOpen });
  }

  toggleHourSelect = (isOpen) => {
    this.setState({ timeSelectOpen: isOpen });
  }

  onDaySelect = (_, selection) => {
    const { input } = this.props;
    const selectedHour = this.parseCurrentValue()[0];
    /* cron syntax:
      00 =  0th minute,
      ${}   selected hour (from current input value)
      * * = disregarding the day of month, every month
      ${}   newly selected day number
    */
    input.onChange(`00 ${selectedHour} * * ${selection}`);
    this.setState({ daySelectOpen: false });
  }

  onHourSelect = (_, selection) => {
    const { input } = this.props;
    const selectedDay = this.parseCurrentValue()[1];
    /* cron syntax:
      00 =  0th minute,
      ${}   newly selected hour
      * * = disregarding the day of month, every month
      ${}   selected day number (from current input value)
    */
    input.onChange(`00 ${selection} * * ${selectedDay}`);
    this.setState({ timeSelectOpen: false });
  }

  /** Parse cron syntax from the redux form value
   * @returns {Array<string>} Array of [hour, day]
   */
  parseCurrentValue() {
    const { input } = this.props;
    if (!input.value) {
      return ['', ''];
    }
    const splitted = input.value.split(' ');
    const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    let day = splitted[splitted.length - 1];
    if (weekdays.includes(day)) {
      day = weekdays.indexOf(day);
    }
    return [splitted[1], day];
  }

  render() {
    const { daySelectOpen, timeSelectOpen } = this.state;
    const { isDisabled, input } = this.props;
    if (input.value && !VALID_SCHEDULE_REGEX.test(input.value)) {
      return (
        <FormGroup
          label="Preferred day and start time"
          className="ocm-upgrade-schedule-selection"
        >
          This cluster has a custom schedule which can not be modified from this page.
          {' '}
          Use the API to set the schedule, or
          {' '}
          <Button variant="link" isInline onClick={() => input.onChange('')}>reset the schedule</Button>
          .
        </FormGroup>
      );
    }
    const [selectedHour, selectedDay] = this.parseCurrentValue();

    const makeHourList = () => {
      const ret = [];
      for (let hour = 0; hour < 24; hour += 1) {
        const value = `${hour.toString().padStart(2, 0)}:00`;
        ret.push(
          <SelectOption key={value} value={hour.toString()}>
            {value}
            {' '}
            UTC
          </SelectOption>,
        );
      }
      return ret;
    };

    return (
      <FormGroup
        label="Preferred day and start time"
        className="ocm-upgrade-schedule-selection"
      >
        <Grid hasGutter>
          <GridItem sm={6} md={4}>
            <Select
              isOpen={daySelectOpen}
              selections={selectedDay}
              onToggle={this.toggleDaySelect}
              onSelect={this.onDaySelect}
              isDisabled={isDisabled}
            >
              <SelectOption isPlaceholder isDisabled value="">Select day</SelectOption>
              {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, idx) => (
                <SelectOption key={day} value={idx.toString()}>
                  {day}
                </SelectOption>
              ))}
            </Select>
          </GridItem>
          <GridItem sm={6} md={4}>
            <Select
              isOpen={timeSelectOpen}
              selections={selectedHour}
              onToggle={this.toggleHourSelect}
              onSelect={this.onHourSelect}
              isDisabled={isDisabled}
            >
              <SelectOption isPlaceholder isDisabled value="">Select hour</SelectOption>
              {makeHourList()}
            </Select>
          </GridItem>
        </Grid>
      </FormGroup>
    );
  }
}
UpgradeScheduleSelection.propTypes = {
  input: PropTypes.shape({
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
  }).isRequired,
  isDisabled: PropTypes.bool,
};

export default UpgradeScheduleSelection;
