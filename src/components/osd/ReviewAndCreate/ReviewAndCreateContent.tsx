import React from 'react';
import isEmpty from 'lodash/isEmpty';

import { Bullseye, Spinner, Stack, StackItem, Title } from '@patternfly/react-core';

import config from '~/config';
import ReviewSection, {
  ReviewItem,
} from '~/components/clusters/CreateOSDPage/CreateOSDWizard/ReviewClusterScreen/ReviewSection';
import { useGlobalState } from '~/redux/hooks/useGlobalState';
import { CloudProviderType } from '../ClusterSettings/CloudProvider/types';
import { FieldId } from '../constants';
import { useFormState } from '../hooks';
import { DebugClusterRequest } from './DebugClusterRequest';

interface ReviewAndCreateContentProps {
  isPending: boolean;
}

export const ReviewAndCreateContent = ({ isPending }: ReviewAndCreateContentProps) => {
  const {
    values: {
      [FieldId.Product]: product,
      [FieldId.InstallToVpc]: installToVpc,
      [FieldId.ConfigureProxy]: configureProxy,
      [FieldId.Byoc]: byoc,
      [FieldId.CloudProvider]: cloudProvider,
      [FieldId.NodeLabels]: nodeLabels,
      [FieldId.ClusterPrivacy]: clusterPrivacy,
    },
    values: formValues,
  } = useFormState();
  const capabilities = useGlobalState(
    (state) => state.userProfile.organization.details?.capabilities,
  );

  const canAutoScale = React.useMemo(() => {
    const autoScaleClusters = capabilities?.find(
      (capability) => capability.name === 'capability.cluster.autoscale_clusters',
    );
    return !!(autoScaleClusters && autoScaleClusters.value === 'true');
  }, [capabilities]);
  const autoscalingEnabled = canAutoScale && !!formValues[FieldId.AutoscalingEnabled];
  const isByoc = byoc === 'true';
  const isAWS = cloudProvider === CloudProviderType.Aws;
  const isGCP = cloudProvider === CloudProviderType.Gcp;

  const clusterSettingsFields = [
    FieldId.CloudProvider,
    FieldId.ClusterName,
    FieldId.ClusterVersion,
    FieldId.Region,
    FieldId.MultiAz,
    ...(!isByoc ? [FieldId.PersistentStorage] : []),
    ...(isByoc && isAWS ? [FieldId.DisableScpChecks] : []),
    FieldId.EnableUserWorkloadMonitoring,
    FieldId.EtcdEncryption,
    ...(isByoc ? [FieldId.CustomerManagedKey] : []),
  ];

  if (isPending) {
    return (
      <Bullseye>
        <Stack>
          <StackItem>
            <Bullseye>
              <Spinner size="xl" isSVG />
            </Bullseye>
          </StackItem>
          <StackItem>
            <Bullseye>
              Creating your cluster. Do not refresh this page. This request may take a moment...
            </Bullseye>
          </StackItem>
        </Stack>
      </Bullseye>
    );
  }

  return (
    <div className="ocm-create-osd-review-screen">
      <Title headingLevel="h2">Review your dedicated cluster</Title>

      <ReviewSection title="Billing model">
        {ReviewItem({ name: FieldId.BillingModel, formValues })}
        {ReviewItem({ name: FieldId.Byoc, formValues })}
      </ReviewSection>

      <ReviewSection title="Cluster settings">
        {clusterSettingsFields.map((name) => ReviewItem({ name, formValues }))}
      </ReviewSection>

      <ReviewSection title="Default machine pool">
        {ReviewItem({ name: FieldId.MachineType, formValues })}
        {canAutoScale && ReviewItem({ name: FieldId.AutoscalingEnabled, formValues })}
        {autoscalingEnabled
          ? ReviewItem({ name: FieldId.MinReplicas, formValues })
          : ReviewItem({ name: FieldId.NodesCompute, formValues })}
        {!(nodeLabels.length === 1 && isEmpty(nodeLabels[0].key)) &&
          ReviewItem({ name: FieldId.NodeLabels, formValues })}
      </ReviewSection>

      <ReviewSection title="Networking">
        {ReviewItem({ name: FieldId.ClusterPrivacy, formValues })}
        {isByoc && ReviewItem({ name: FieldId.InstallToVpc, formValues })}
        {isByoc &&
          clusterPrivacy === 'internal' &&
          installToVpc &&
          ReviewItem({ name: FieldId.UsePrivateLink, formValues })}
        {isByoc && installToVpc && isAWS && ReviewItem({ name: 'aws_vpc', formValues })}
        {isByoc && installToVpc && isGCP && ReviewItem({ name: 'gpc_vpc', formValues })}
        {installToVpc && ReviewItem({ name: FieldId.ConfigureProxy, formValues })}
        {installToVpc && configureProxy && ReviewItem({ name: FieldId.HttpProxyUrl, formValues })}
        {installToVpc && configureProxy && ReviewItem({ name: FieldId.HttpsProxyUrl, formValues })}
        {installToVpc &&
          configureProxy &&
          ReviewItem({ name: FieldId.AdditionalTrustBundle, formValues })}
        {ReviewItem({ name: FieldId.NetworkMachineCidr, formValues })}
        {ReviewItem({ name: FieldId.NetworkServiceCidr, formValues })}
        {ReviewItem({ name: FieldId.NetworkPodCidr, formValues })}
        {ReviewItem({ name: FieldId.NetworkHostPrefix, formValues })}
      </ReviewSection>

      <ReviewSection title="Updates">
        {ReviewItem({ name: FieldId.UpgradePolicy, formValues })}
        {formValues[FieldId.UpgradePolicy] === 'automatic' &&
          ReviewItem({ name: FieldId.AutomaticUpgradeSchedule, formValues })}
        {ReviewItem({ name: FieldId.NodeDrainGracePeriod, formValues })}
      </ReviewSection>

      {config.fakeOSD && (
        <DebugClusterRequest
          cloudProvider={cloudProvider}
          product={product}
          formValues={formValues}
        />
      )}
    </div>
  );
};
