import * as React from 'react';
import { Field } from 'formik';

import { Flex, Form, Grid, GridItem, Text, TextVariants, Title } from '@patternfly/react-core';

import links from '~/common/installLinks.mjs';
import ExternalLink from '~/components/common/ExternalLink';
import {
  FieldId,
  initialValues,
  UpgradePolicyType,
} from '~/components/clusters/wizards/common/constants';
import { useFormState } from '~/components/clusters/wizards/hooks';
import { RadioGroupField } from '~/components/clusters/wizards/form';
import UpgradeScheduleSelection from '~/components/clusters/common/Upgrades/UpgradeScheduleSelection';
import PodDistruptionBudgetGraceSelect from '~/components/clusters/common/Upgrades/PodDistruptionBudgetGraceSelect';

export const ClusterUpdates = () => {
  const {
    values: { [FieldId.UpgradePolicy]: upgradePolicy },
    setFieldValue,
    getFieldProps,
  } = useFormState();

  const upgradePolicyOptions = [
    {
      value: UpgradePolicyType.Manual,
      label: 'Individual updates',
      description: (
        <>
          Schedule each update individually. Take into consideration end of life dates from the{' '}
          <ExternalLink href={links.OSD_LIFE_CYCLE}>lifecycle policy</ExternalLink> when planning
          updates.
        </>
      ),
    },
    {
      value: UpgradePolicyType.Automatic,
      label: 'Recurring updates',
      description: (
        <>
          The cluster will be automatically updated based on your preferred day and start time when
          new patch updates (<ExternalLink href={links.OSD_Z_STREAM}>z-stream</ExternalLink>) are
          available. When a new minor version is available, you&apos;ll be notified and must
          manually allow the cluster to update to the next minor version.
        </>
      ),
    },
  ];

  const onUpgradePolicyChange = (value: string) => {
    if (value === UpgradePolicyType.Manual) {
      setFieldValue(
        FieldId.AutomaticUpgradeSchedule,
        initialValues[FieldId.AutomaticUpgradeSchedule],
      );
    }
  };

  return (
    <Form>
      <GridItem>
        <Title headingLevel="h3">Cluster update strategy</Title>

        <Text component={TextVariants.p} className="pf-u-mt-sm">
          In the event of{' '}
          <ExternalLink href="https://access.redhat.com/security/updates/classification/#critical">
            Critical security concerns
          </ExternalLink>{' '}
          (CVEs) that significantly impact the security or stability of the cluster, updates may be
          automatically scheduled by Red Hat SRE to the latest z-stream version not impacted by the
          CVE within 48 hours after customer notifications.
        </Text>
      </GridItem>

      <Grid hasGutter md={6}>
        <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsLg' }}>
          <GridItem>
            <RadioGroupField
              name={FieldId.UpgradePolicy}
              options={upgradePolicyOptions}
              onChange={onUpgradePolicyChange}
            />

            {upgradePolicy === UpgradePolicyType.Automatic && (
              <Field
                component={UpgradeScheduleSelection}
                name={FieldId.AutomaticUpgradeSchedule}
                input={{
                  ...getFieldProps(FieldId.AutomaticUpgradeSchedule),
                  onChange: (value: string) =>
                    setFieldValue(FieldId.AutomaticUpgradeSchedule, value),
                }}
                className="pf-u-mt-md"
              />
            )}
          </GridItem>
        </Flex>
      </Grid>

      <GridItem>
        <Title headingLevel="h4" className="ocm-c-upgrade-node-draining-title">
          Node draining
        </Title>

        <Text component={TextVariants.p}>
          You may set a grace period for how long pod disruption budget-protected workloads will be
          respected during updates. After this grace period, any workloads protected by pod
          disruption budgets that have not been successfully drained from a node will be forcibly
          evicted.
        </Text>

        <Field
          name={FieldId.NodeDrainGracePeriod}
          component={PodDistruptionBudgetGraceSelect}
          input={{
            ...getFieldProps(FieldId.NodeDrainGracePeriod),
            onChange: (value: string) => setFieldValue(FieldId.NodeDrainGracePeriod, value),
          }}
        />
      </GridItem>
    </Form>
  );
};
