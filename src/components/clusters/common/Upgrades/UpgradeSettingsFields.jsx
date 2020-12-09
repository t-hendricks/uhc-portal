// Form fields for upgrade settings, used in Upgrade Settings tab and in cluster creation
import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import {
  Divider, Title, GridItem,
} from '@patternfly/react-core';

import ExternalLink from '../../../common/ExternalLink';
import RadioButtons from '../../../common/ReduxFormComponents/RadioButtons';
import UpgradeScheduleSelection from './UpgradeScheduleSelection';
import PodDistruptionBudgetGraceSelect from './PodDistruptionBudgetGraceSelect';
import './UpgradeSettingsFields.scss';

function UpgradeSettingsFields({ isDisabled, isAutomatic, showDivider }) {
  return (
    <>
      <GridItem span={12} className="ocm-c-upgrade-policy-radios">
        <Field
          component={RadioButtons}
          name="upgrade_policy"
          isDisabled={isDisabled}
          options={[
            {
              value: 'automatic',
              label: 'Automatic',
              description: 'Clusters will be automatically updated based on your defined day and start time when new versions are available',
              extraField: isAutomatic && (
              <Field
                component={UpgradeScheduleSelection}
                name="automatic_upgrade_schedule"
                isDisabled={isDisabled}
              />
              ),
            },
            {
              value: 'manual',
              label: 'Manual',
              description: (
                <>
        You are responsible for updating your cluster.
                  {' '}
        Note that if your cluster version falls too far behind,
                  {' '}
        it will be automatically updated. See the
                  {' '}
                  <ExternalLink href="https://access.redhat.com/support/policy/updates/openshift">version support information</ExternalLink>
        .
                  <p>
        Note: High and Critical security concerns (CVEs) will be patched automatically
                    {' '}
          within 48 hours, regardless of your chosen update strategy.
                  </p>
                </>
              ),
            },
          ]}
          defaultValue="manual"
        />
      </GridItem>
      {showDivider && <Divider />}
      <GridItem span={12}>
        <Title headingLevel="h4" className="ocm-c-upgrade-node-draining-title">Node draining</Title>
      You may set a grace period for how long Pod Disruption Budget-protected workloads will
        {' '}
      be respected during updates. After this grace period, any workloads protected by
        {' '}
      Pod Disruption Budgets that have not been successfully drained from a node will be
        {' '}
      forcibly evicted.
        <Field
          name="node_drain_grace_period"
          component={PodDistruptionBudgetGraceSelect}
          isDisabled={isDisabled}
        />
      </GridItem>
    </>
  );
}

UpgradeSettingsFields.propTypes = {
  isAutomatic: PropTypes.bool,
  isDisabled: PropTypes.bool,
  showDivider: PropTypes.bool,
};

export default UpgradeSettingsFields;
