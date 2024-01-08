import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Grid, GridItem, Button, Alert } from '@patternfly/react-core';
import {
  Select as SelectDeprecated,
  SelectOption as SelectOptionDeprecated,
} from '@patternfly/react-core/deprecated';
import parseUpdateSchedule from './parseUpdateSchedule';
import './UpgradeSettingsFields.scss';

const VALID_SCHEDULE_REGEX = /00? [0-9][0-9]? \* \* ([0-6]|SUN|MON|TUE|WED|THU|FRI|SAT)/i;

class UpgradeScheduleSelection extends React.Component {
  state = {
    daySelectOpen: false,
    timeSelectOpen: false,
  };

  toggleDaySelect = (isOpen) => {
    this.setState({ daySelectOpen: isOpen });
  };

  toggleHourSelect = (isOpen) => {
    this.setState({ timeSelectOpen: isOpen });
  };

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
  };

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
  };

  /** Parse cron syntax from the redux form value
   * @returns {Array<string>} Array of [hour, day]
   */
  parseCurrentValue() {
    const { input } = this.props;
    if (!input.value) {
      return ['', ''];
    }
    return parseUpdateSchedule(input.value);
  }

  render() {
    const { daySelectOpen, timeSelectOpen } = this.state;
    const { isDisabled, input, isHypershift } = this.props;
    const infoAlert =
      'Recurring updates occur when a new patch (z-stream) update becomes available at least 2 days prior to your selected start time.';
    const infoAlertHypershift =
      'For recurring updates, the control plane will be updated when a new version becomes available at least 2 days prior to your selected start time. Worker nodes will need to be manually updated.';

    if (input.value && !VALID_SCHEDULE_REGEX.test(input.value)) {
      return (
        <>
          <Alert
            id="automatic-cluster-updates-alert"
            className="automatic-cluster-updates-alert inline-alert"
            isInline
            isPlain
            variant="info"
            title={isHypershift ? infoAlertHypershift : infoAlert}
          />
          <FormGroup label="Select a day and start time" className="ocm-upgrade-schedule-selection">
            This cluster has a custom schedule which can not be modified from this page. Use the API
            to set the schedule, or{' '}
            <Button variant="link" isInline onClick={() => input.onChange('')}>
              reset the schedule
            </Button>
            .
          </FormGroup>
        </>
      );
    }
    const [selectedHour, selectedDay] = this.parseCurrentValue();

    const makeHourList = () => {
      const ret = [];
      for (let hour = 0; hour < 24; hour += 1) {
        const value = `${hour.toString().padStart(2, 0)}:00`;
        ret.push(
          <SelectOptionDeprecated key={value} value={hour.toString()}>
            {value} UTC
          </SelectOptionDeprecated>,
        );
      }
      return ret;
    };

    return (
      <>
        <Alert
          id="automatic-cluster-updates-alert"
          className="automatic-cluster-updates-alert inline-alert"
          isInline
          isPlain
          variant="info"
          title={isHypershift ? infoAlertHypershift : infoAlert}
        />
        <FormGroup label="Select a day and start time" className="ocm-upgrade-schedule-selection">
          <Grid hasGutter>
            <GridItem sm={6} md={6}>
              <SelectDeprecated
                isOpen={daySelectOpen}
                selections={selectedDay}
                onToggle={(_event, isOpen) => this.toggleDaySelect(isOpen)}
                onSelect={this.onDaySelect}
                isDisabled={isDisabled}
              >
                <SelectOptionDeprecated isPlaceholder isDisabled value="">
                  Select day
                </SelectOptionDeprecated>
                {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(
                  (day, idx) => (
                    <SelectOptionDeprecated key={day} value={idx.toString()}>
                      {day}
                    </SelectOptionDeprecated>
                  ),
                )}
              </SelectDeprecated>
            </GridItem>
            <GridItem sm={6} md={6}>
              <SelectDeprecated
                isOpen={timeSelectOpen}
                selections={selectedHour}
                onToggle={(_event, isOpen) => this.toggleHourSelect(isOpen)}
                onSelect={this.onHourSelect}
                isDisabled={isDisabled}
              >
                <SelectOptionDeprecated isPlaceholder isDisabled value="">
                  Select hour
                </SelectOptionDeprecated>
                {makeHourList()}
              </SelectDeprecated>
            </GridItem>
          </Grid>
        </FormGroup>
      </>
    );
  }
}
UpgradeScheduleSelection.propTypes = {
  input: PropTypes.shape({
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
  }).isRequired,
  isDisabled: PropTypes.bool,
  isHypershift: PropTypes.bool,
};

export default UpgradeScheduleSelection;
