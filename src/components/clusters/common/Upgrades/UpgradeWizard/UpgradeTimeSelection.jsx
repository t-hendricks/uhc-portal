import React from 'react';
import PropTypes from 'prop-types';
import {
  Radio, Tooltip, Title, FormGroup, Form,
} from '@patternfly/react-core';

class UpgradeTimeSelection extends React.Component {
  checkBoxChange = (type) => {
    const { onSet } = this.props;
    if (type === 'now') {
      onSet({ type: 'now' }); // empty timestamp = now
    } else {
      onSet({ type: 'time', timestamp: undefined });
    }
  }

  render() {
    const { type } = this.props;
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
          />
        </FormGroup>
        <Tooltip
          content="Coming soon!"
          position="left"
        >
          <FormGroup fieldId="upgrade-schedule-time">
            <Radio
              isChecked={type === 'time'}
              name="upgrade-schedule-type"
              id="upgrade-schedule-time"
              value="time"
              label="Schedule a different time"
              isDisabled
            />
          </FormGroup>
        </Tooltip>
      </Form>
    );
  }
}

UpgradeTimeSelection.propTypes = {
  onSet: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['now', 'time']),
};

export default UpgradeTimeSelection;
