import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import {
  Title,
  Bullseye,
  Stack,
  StackItem,
  Spinner,
} from '@patternfly/react-core';

import DebugClusterRequest from '../../DebugClusterRequest';
import config from '../../../../../config';
import { normalizedProducts } from '../../../../../common/subscriptionTypes';

import './ReviewClusterScreen.scss';
import ReviewSection, { ReviewItem } from './ReviewSection';

function ReviewClusterScreen({
  clusterRequestParams,
  formValues,
  canAutoScale,
  autoscalingEnabled,
  isPending,
}) {
  const isByoc = formValues.byoc === 'true';
  const isAWS = formValues.cloud_provider === 'aws';
  const isGCP = formValues.cloud_provider === 'gcp';
  const isROSA = formValues.product === normalizedProducts.ROSA;
  const showVPCCheckbox = isROSA || isByoc;
  const clusterSettingsFields = [
    'cloud_provider', 'name',
    isROSA && 'operator_roles_name',
    'cluster_version', 'region', 'multi_az',
    !isByoc && !isROSA && 'persistent_storage',
    !isByoc && isROSA && 'load_balancers',
    isByoc && isAWS && !isROSA && 'disable_scp_checks',
    'enable_user_workload_monitoring',
    'etcd_encryption',
    isByoc && 'customer_managed_key',
  ].filter(Boolean);
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
      <Title headingLevel="h2" className="pf-u-pb-md">
        Review your
        {' '}
        {isROSA ? 'ROSA' : 'dedicated'}
        {' '}
        cluster
      </Title>
      {isROSA && (
        <ReviewSection title="Accounts and roles" initiallyExpanded={false}>
          {ReviewItem({ name: 'associated_aws_id', formValues })}
          {ReviewItem({ name: 'installer_role_arn', formValues })}
          {ReviewItem({ name: 'support_role_arn', formValues })}
          {ReviewItem({ name: 'control_plane_role_arn', formValues })}
          {ReviewItem({ name: 'worker_role_arn', formValues })}
        </ReviewSection>
      )}
      {!isROSA && (
      <ReviewSection title="Billing Model">
        {ReviewItem({ name: 'billing_model', formValues })}
        {ReviewItem({ name: 'byoc', formValues })}
      </ReviewSection>
      )}
      <ReviewSection title="Cluster settings">
        {clusterSettingsFields.map(name => ReviewItem({ name, formValues }))}
      </ReviewSection>
      <ReviewSection title="Default machine pool">
        {ReviewItem({ name: 'machine_type', formValues })}
        {canAutoScale && ReviewItem({ name: 'autoscalingEnabled', formValues })}
        {autoscalingEnabled
          ? ReviewItem({ name: 'min_replicas', formValues })
          : ReviewItem({ name: 'nodes_compute', formValues })}
        {!(formValues.node_labels.length === 1 && isEmpty(formValues.node_labels[0]))
        && ReviewItem({ name: 'node_labels', formValues })}
      </ReviewSection>
      <ReviewSection title="Networking">
        {ReviewItem({ name: 'cluster_privacy', formValues })}
        {showVPCCheckbox && ReviewItem({ name: 'install_to_vpc', formValues })}
        {showVPCCheckbox && formValues.cluster_privacy === 'internal' && formValues.install_to_vpc
        && ReviewItem({ name: 'use_privatelink', formValues })}
        {showVPCCheckbox && formValues.install_to_vpc && isAWS && ReviewItem({ name: 'aws_vpc', formValues })}
        {showVPCCheckbox && formValues.install_to_vpc && isGCP && ReviewItem({ name: 'gpc_vpc', formValues })}
        {ReviewItem({ name: 'network_machine_cidr', formValues })}
        {ReviewItem({ name: 'network_service_cidr', formValues })}
        {ReviewItem({ name: 'network_pod_cidr', formValues })}
        {ReviewItem({ name: 'network_host_prefix', formValues })}
      </ReviewSection>
      <ReviewSection title="Updates">
        {ReviewItem({ name: 'upgrade_policy', formValues })}
        {formValues.upgrade_policy === 'automatic' && ReviewItem({ name: 'automatic_upgrade_schedule', formValues })}
        {ReviewItem({ name: 'node_drain_grace_period', formValues })}
      </ReviewSection>

      {config.fakeOSD && <DebugClusterRequest {...clusterRequestParams} /> }
    </div>
  );
}
ReviewClusterScreen.propTypes = {
  clusterRequestParams: PropTypes.object.isRequired,
  formValues: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  ),
  isPending: PropTypes.bool,
  canAutoScale: PropTypes.bool,
  autoscalingEnabled: PropTypes.bool,
};

export default ReviewClusterScreen;
