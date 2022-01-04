/* eslint-disable react/no-unescaped-entities */
// Form fields for upgrade settings, used in Upgrade Settings tab and in cluster creation
import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import {
  Divider, Title, GridItem, Alert, TextContent, TextVariants, Text,
} from '@patternfly/react-core';

import ExternalLink from '../../../common/ExternalLink';
import RadioButtons from '../../../common/ReduxFormComponents/RadioButtons';
import UpgradeScheduleSelection from './UpgradeScheduleSelection';
import PodDistruptionBudgetGraceSelect from './PodDistruptionBudgetGraceSelect';
import './UpgradeSettingsFields.scss';

function UpgradeSettingsFields({
  isDisabled, isAutomatic, showDivider, change, initialSceduleValue,
}) {
  return (
    <>
      <GridItem className="ocm-c-upgrade-policy-radios">
        <Field
          component={RadioButtons}
          name="upgrade_policy"
          isDisabled={isDisabled}
          onChange={(_, value) => {
            if (change && value === 'manual') {
              change('automatic_upgrade_schedule', initialSceduleValue);
            }
          }}
          options={[
            {
              value: 'manual',
              label: 'Manual',
              description: (
                <>
                  You are responsible for updating your cluster.
                  {' '}
                  Note that if your cluster version falls more than 1 minor version behind
                  {' '}
                  the latest available, it will have SRE alerting disabled and will be
                  unsupported until it's upgraded. See the
                  {' '}
                  <ExternalLink href="https://access.redhat.com/support/policy/updates/openshift/dedicated">version support information</ExternalLink>
                  .
                  <p>
                    Note: High and Critical security concerns (CVEs) will be automatically
                    {' '}
                    updated to the latest z-stream version not impacted by the CVE.
                  </p>
                </>
              ),
            },
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
          ]}
          defaultValue="manual"
          disableDefaultValueHandling // interferes with enableReinitialize.
        />
        <Alert
          id="automatic-cluster-updates-alert"
          isInline
          variant="info"
          title="Automatic updates occur when a new version becomes available at least two days prior to your selected start time."
        />
      </GridItem>
      {showDivider && <Divider />}
      <GridItem>
        <Title headingLevel="h4" className="ocm-c-upgrade-node-draining-title">Node draining</Title>
        <TextContent>
          <Text component={TextVariants.p}>
            You may set a grace period for how long Pod Disruption Budget-protected workloads will
            {' '}
            be respected during updates. After this grace period, any workloads protected by
            {' '}
            Pod Disruption Budgets that have not been successfully drained from a node will be
            {' '}
            forcibly evicted.
          </Text>
        </TextContent>
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
  change: PropTypes.func,
  initialSceduleValue: PropTypes.string,
};

export default UpgradeSettingsFields;
