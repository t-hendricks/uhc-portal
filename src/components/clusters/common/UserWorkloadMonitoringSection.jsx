import React from 'react';
import PropTypes from 'prop-types';
import { GridItem, Title } from '@patternfly/react-core';
import { Field } from 'redux-form';
import links from '../../../common/installLinks.mjs';
import ReduxCheckbox from '../../common/ReduxFormComponents/ReduxCheckbox';
import { constants } from '../CreateOSDPage/CreateOSDForm/CreateOSDFormConstants';
import ExternalLink from '../../common/ExternalLink';
import '../CreateOSDPage/CreateOSDForm/CreateOSDForm.scss';

function UserWorkloadMonitoringSection({ parent, disableUVM }) {
  const title = <Title headingLevel="h3"> Monitoring </Title>;
  return (
    <>
      {parent === 'create' ? <GridItem>{title}</GridItem> : title}
      <Field
        component={ReduxCheckbox}
        name="enable_user_workload_monitoring"
        label="Enable user workload monitoring"
        isDisabled={disableUVM}
        extendedHelpText={(
          <>
            {constants.enableUserWorkloadMonitoringHelp}
            {' '}
            <ExternalLink href={links.ROSA_MONITORING}>Learn more</ExternalLink>
          </>
                )}
      />
      <div className="ocm-c--reduxcheckbox-description">{constants.enableUserWorkloadMonitoringHint}</div>
    </>
  );
}

UserWorkloadMonitoringSection.propTypes = {
  parent: PropTypes.string,
  disableUVM: PropTypes.bool,
};

export default UserWorkloadMonitoringSection;
