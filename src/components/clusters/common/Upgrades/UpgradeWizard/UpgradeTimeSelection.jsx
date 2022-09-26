import React from 'react';
import PropTypes from 'prop-types';
import {
  Radio,
  Title,
  FormGroup,
  Form,
  TextInput,
  Select,
  SelectOption,
} from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
import DatePicker from 'react-datepicker';

class UpgradeTimeSelection extends React.Component {
  state = { timeSelectionOpen: false };

  getDefaultTimestamp = () => {
    const HOUR_IN_MS = 60 * 60 * 1000;
    const atLeastOneHourFromNow = new Date(new Date().getTime() + HOUR_IN_MS);
    if (atLeastOneHourFromNow.getMinutes() > 5) {
      atLeastOneHourFromNow.setHours(atLeastOneHourFromNow.getHours() + 1);
    }
    atLeastOneHourFromNow.setSeconds(0);
    atLeastOneHourFromNow.setMilliseconds(0);
    atLeastOneHourFromNow.setMinutes(0);

    return atLeastOneHourFromNow;
  };

  modeChange = (_, event) => {
    const { onSet, timestamp } = this.props;
    if (event.target.value === 'now') {
      onSet({ type: 'now' }); // empty timestamp = now
    } else {
      const defaultTimeStamp = timestamp || this.getDefaultTimestamp().toISOString();
      onSet({ type: 'time', timestamp: defaultTimeStamp });
    }
  };

  setDate = (selectedDate) => {
    const { onSet } = this.props;
    const minimum = this.getDefaultTimestamp();
    /* set the selected date. If the date + time is lower tha minimum,
      set it to the minimum instead */
    const selected = selectedDate < minimum ? minimum : selectedDate;
    onSet({ type: 'time', timestamp: selected });
  };

  setTime = (_, selectedTime) => {
    const { onSet, timestamp } = this.props;
    // Take the time from the time picker, combine it with the date in the current timestamp
    const date = new Date(timestamp);
    const [hour, minute] = selectedTime.split(':');
    date.setHours(hour);
    date.setMinutes(minute);
    onSet({ type: 'time', timestamp: date.toISOString() });
    this.setState({ timeSelectionOpen: false });
  };

  onSelectToggle = () => {};

  render() {
    const { type, timestamp } = this.props;
    const { timeSelectionOpen } = this.state;
    if (timeSelectionOpen) {
      // scroll to the selected item when the Select is opened
      setTimeout(() => {
        requestAnimationFrame(() => {
          const selected = document.querySelector(
            '#upgrade-time-select-dropdown .pf-c-select__menu-item.pf-m-selected',
          );
          if (selected) {
            selected.scrollIntoView({ block: 'center' });
          }
        });
      }, 1);
    }

    const makeSelectOptions = () => {
      const ret = [];
      for (let hour = 0; hour < 24; hour += 1) {
        const value = `${hour.toString().padStart(2, 0)}:00`;
        const date = new Date(timestamp);
        date.setHours(hour);
        date.setMinutes(0);
        ret.push(
          <SelectOption value={value} key={value} isDisabled={this.getDefaultTimestamp() > date}>
            {value}
          </SelectOption>,
        );
      }
      return ret;
    };

    const getSelectedTime = () => {
      const date = new Date(timestamp);
      const hour = date.getHours().toString().padStart(2, 0);
      const minute = date.getMinutes().toString().padStart(2, 0);
      return `${hour}:${minute}`;
    };

    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 6);

    return (
      <>
        <Title className="wizard-step-title" size="lg" headingLevel="h3">
          Schedule update
        </Title>
        <Form className="wizard-step-body">
          <FormGroup fieldId="upgrade-schedule-now">
            <Radio
              isChecked={type === 'now'}
              name="upgrade-schedule-type"
              id="upgrade-schedule-now"
              value="now"
              label="Update now (update will begin within the next hour)"
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
          {type === 'time' && (
            <>
              <FormGroup
                fieldId="upgrade-schedule-datepicker"
                className="upgrade-schedule-datepicker"
              >
                <DatePicker
                  id="upgrade-schedule-datepicker"
                  selected={timestamp && new Date(timestamp)}
                  onChange={this.setDate}
                  dateFormat="yyyy-MM-dd"
                  customInput={<TextInput iconVariant="calendar" />}
                  minDate={new Date()}
                  maxDate={maxDate}
                />
                <Select
                  selections={getSelectedTime()}
                  onSelect={this.setTime}
                  onToggle={() =>
                    this.setState((state) => ({ timeSelectionOpen: !state.timeSelectionOpen }))
                  }
                  isOpen={timeSelectionOpen}
                  id="upgrade-time-select-dropdown"
                >
                  {makeSelectOptions()}
                </Select>
              </FormGroup>
              <dl className="cluster-upgrade-dl">
                <dt>UTC </dt>
                <dd>
                  <DateFormat type="exact" date={new Date(timestamp)} />
                </dd>
              </dl>
            </>
          )}
        </Form>
      </>
    );
  }
}

UpgradeTimeSelection.propTypes = {
  onSet: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['now', 'time']),
  timestamp: PropTypes.string,
};

export default UpgradeTimeSelection;
