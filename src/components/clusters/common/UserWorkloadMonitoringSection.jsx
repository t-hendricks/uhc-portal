import React from 'react';
import PropTypes from 'prop-types';
import { GridItem, Title } from '@patternfly/react-core';
import { Field } from 'redux-form';
import links from '../../../common/installLinks.mjs';
import ReduxCheckbox from '../../common/ReduxFormComponents/ReduxCheckbox';
import { constants } from '../CreateOSDPage/CreateOSDForm/CreateOSDFormConstants';
import ExternalLink from '../../common/ExternalLink';
import { normalizedProducts } from '../../../common/subscriptionTypes';
import '../CreateOSDPage/CreateOSDForm/CreateOSDForm.scss';

function UserWorkloadMonitoringSection({
  parent, disableUVM, planType,
}) {
  const title = <Title headingLevel="h3"> Monitoring </Title>;
  const isROSA = planType === normalizedProducts.ROSA;
  const isOSD = planType === normalizedProducts.OSD || planType === normalizedProducts.OSDTrial;
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
            {isROSA || isOSD
              ? (
                <ExternalLink href={isROSA
                  ? links.ROSA_MONITORING : links.OSD_MONITORING_STACK}
                >
                  Learn more
                </ExternalLink>
              ) : null}
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
  planType: PropTypes.string,
};

export default UserWorkloadMonitoringSection;
