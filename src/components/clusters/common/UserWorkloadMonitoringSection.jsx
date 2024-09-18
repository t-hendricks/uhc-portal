import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import { GridItem, Title } from '@patternfly/react-core';

import links from '~/common/installLinks.mjs';
import { normalizedProducts } from '~/common/subscriptionTypes';
import { CheckboxDescription } from '~/components/common/CheckboxDescription';
import ReduxCheckbox from '~/components/common/ReduxFormComponents/ReduxCheckbox';

import ExternalLink from '../../common/ExternalLink';

import { constants } from './CreateOSDFormConstants';

function UserWorkloadMonitoringSection({ parent, disableUVM, planType }) {
  const title = <Title headingLevel="h4"> Monitoring </Title>;
  const isROSA = planType === normalizedProducts.ROSA;
  const isOSD = planType === normalizedProducts.OSD || planType === normalizedProducts.OSDTRIAL;
  return (
    <>
      {parent === 'create' ? <GridItem>{title}</GridItem> : title}
      <Field
        component={ReduxCheckbox}
        name="enable_user_workload_monitoring"
        label="Enable user workload monitoring"
        isDisabled={disableUVM}
        extendedHelpText={
          <>
            {constants.enableUserWorkloadMonitoringHelp}{' '}
            {isROSA || isOSD ? (
              <ExternalLink href={isROSA ? links.ROSA_MONITORING : links.OSD_MONITORING_STACK}>
                Learn more
              </ExternalLink>
            ) : null}
          </>
        }
      />
      <CheckboxDescription>{constants.enableUserWorkloadMonitoringHint}</CheckboxDescription>
    </>
  );
}

UserWorkloadMonitoringSection.propTypes = {
  parent: PropTypes.string,
  disableUVM: PropTypes.bool,
  planType: PropTypes.string,
};

export default UserWorkloadMonitoringSection;
