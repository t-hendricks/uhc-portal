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
import links from '../../../../common/installLinks.mjs';
import { normalizedProducts } from '../../../../common/subscriptionTypes';

function UpgradeSettingsFields({
  isDisabled, isAutomatic, showDivider, change, initialSceduleValue, product,
}) {
  const isRosa = product === normalizedProducts.ROSA;
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
                    href={isRosa ? links.ROSA_LIFE_CYCLE : links.OSD_LIFE_CYCLE}
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
              description: (
                <>
                  The cluster will be automatically updated based on your
                  {' '}
                  preferred day and start time when new patch updates
                  {' '}
                  (
                  <ExternalLink
                    href={isRosa ? links.ROSA_Z_STREAM : links.OSD_Z_STREAM}
                  >
                    z-stream
                  </ExternalLink>
                  )
                  {' '}
                  are available. When a new minor version is available,
                  {' '}
                  you'll be notified and must manually allow the cluster
                  {' '}
                  {' '}
                  to update to the next minor version.
                </>),
              extraField: isAutomatic && (
                <>
                  <Field
                    component={UpgradeScheduleSelection}
                    name="automatic_upgrade_schedule"
                    isDisabled={isDisabled}
                  />
                </>
              ),
            },
          ]}
          defaultValue="manual"
          disableDefaultValueHandling // interferes with enableReinitialize.
        />
      </GridItem>
      {showDivider && <Divider />}
      <GridItem>
        <Title headingLevel="h4" className="ocm-c-upgrade-node-draining-title">
          Node draining
        </Title>
        <TextContent>
          <Text component={TextVariants.p}>
            You may set a grace period for how long pod disruption budget-protected workloads will
            {' '}
            be respected during updates. After this grace period, any workloads protected by
            {' '}
            pod disruption budgets that have not been successfully drained from a node will be
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
