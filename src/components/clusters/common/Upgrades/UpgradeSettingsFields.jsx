/* eslint-disable react/no-unescaped-entities */
// Form fields for upgrade settings, used in Upgrade Settings tab and in cluster creation
import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import {
  Divider, Title, GridItem, TextContent, TextVariants, Text,
} from '@patternfly/react-core';

import ExternalLink from '../../../common/ExternalLink';
import RadioButtons from '../../../common/ReduxFormComponents/RadioButtons';
import UpgradeScheduleSelection from './UpgradeScheduleSelection';
import PodDistruptionBudgetGraceSelect from './PodDistruptionBudgetGraceSelect';
import './UpgradeSettingsFields.scss';
import { normalizedProducts } from '../../../../common/subscriptionTypes';

function UpgradeSettingsFields({
  isDisabled, isAutomatic, showDivider, change, initialSceduleValue, product,
}) {
  const isRosa = product === normalizedProducts.ROSA;
  const osdLifeCycleLink = 'https://docs.openshift.com/dedicated/osd_policy/osd-life-cycle.html';
  const rosaLifeCycleLink = 'https://docs.openshift.com/rosa/rosa_policy/rosa-life-cycle.html';
  return (
    <>
      <GridItem>
        <Text component="p">
          Note: In the event of
          {' '}
          <ExternalLink href="https://access.redhat.com/security/updates/classification/#critical">Critical security concerns</ExternalLink>
          {' '}
          (CVEs) that significantly impact the security or stability of the cluster, updates may be
          {' '}
          automatically scheduled by Red Hat SRE to the latest z-stream version not impacted by the
          {' '}
          CVE within 48 hours after customer notifications.
        </Text>
      </GridItem>
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
              label: 'Individual updates',
              description: (
                <>
                  Schedule each update individually. Take into consideration end of life dates from
                  {' '}
                  the
                  {' '}
                  <ExternalLink
                    href={isRosa ? rosaLifeCycleLink : osdLifeCycleLink}
                  >
                    lifecycle policy
                  </ExternalLink>
                  {' '}
                  when planning updates.
                </>
              ),
            },
            {
              value: 'automatic',
              label: 'Recurring updates',
              description: 'The cluster will be automatically updated based on your preferred day and start time when new versions are available.',
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
  product: PropTypes.string,
  initialSceduleValue: PropTypes.string,
};

export default UpgradeSettingsFields;
