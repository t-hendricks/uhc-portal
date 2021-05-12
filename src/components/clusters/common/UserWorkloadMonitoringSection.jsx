import React from 'react';
import PropTypes from 'prop-types';
import {
  FormGroup, Text, Title,
} from '@patternfly/react-core';
import { Field } from 'redux-form';
import ReduxCheckbox from '../../common/ReduxFormComponents/ReduxCheckbox';
import { constants } from '../CreateOSDPage/CreateOSDForm/CreateOSDFormConstants';
import ExternalLink from '../../common/ExternalLink';
import '../CreateOSDPage/CreateOSDForm/CreateOSDForm.scss';

function UserWorkloadMonitoringSection({ parent }) {
  return (
    <>
      {parent === 'create' ? <Text className="enableuwmcreate"> Monitoring </Text>
        : <Title headingLevel="h3" className="enableuwm"> Monitoring </Title>}
      <FormGroup
        fieldId="enable_user_workload_monitoring"
        id="enable_user_workload_monitoring"
      >
        <Field
          component={ReduxCheckbox}
          name="enable_user_workload_monitoring"
          label="Enable user workload monitoring"
          extendedHelpText={(
            <>
              {constants.enableUserWorkloadMonitoringHelp}
              {' '}
              <ExternalLink href="https://docs.openshift.com/rosa/monitoring/osd-understanding-the-monitoring-stack.html">Learn more</ExternalLink>
            </>
                )}
        />
        <div className="ocm-c--reduxcheckbox-description">{constants.enableUserWorkloadMonitoringHint}</div>
      </FormGroup>
    </>
  );
}

UserWorkloadMonitoringSection.propTypes = {
  parent: PropTypes.string,
};

export default UserWorkloadMonitoringSection;
