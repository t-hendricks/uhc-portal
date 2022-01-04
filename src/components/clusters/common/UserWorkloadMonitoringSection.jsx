import React from 'react';
import PropTypes from 'prop-types';
import {
  FormGroup, GridItem, Title,
} from '@patternfly/react-core';
import { Field } from 'redux-form';
import ReduxCheckbox from '../../common/ReduxFormComponents/ReduxCheckbox';
import { constants } from '../CreateOSDPage/CreateOSDForm/CreateOSDFormConstants';
import ExternalLink from '../../common/ExternalLink';
import '../CreateOSDPage/CreateOSDForm/CreateOSDForm.scss';

function UserWorkloadMonitoringSection({ parent, disableUVM }) {
  const title = <Title headingLevel="h3"> Monitoring </Title>;
  return (
    <>
      {parent === 'create' ? <GridItem>{title}</GridItem> : title}
      <FormGroup
        fieldId="enable_user_workload_monitoring"
        id="enable_user_workload_monitoring"
      >
        <Field
          component={ReduxCheckbox}
          name="enable_user_workload_monitoring"
          label="Enable user workload monitoring"
          isDisabled={disableUVM}
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
  disableUVM: PropTypes.bool,
};

export default UserWorkloadMonitoringSection;
