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
import './ReviewClusterScreen.scss';
import ReviewSection, { ReviewItem } from './ReviewSection';

function ReviewClusterScreen({
  formValues,
  canAutoScale,
  autoscalingEnabled,
  isPending,
}) {
  const clusterSettingsFields = [
    'name', 'operator_roles_name',
    'cluster_version', 'region', 'multi_az',
    'enable_user_workload_monitoring',
    'etcd_encryption',
    'machine_type',
    canAutoScale && 'autoscalingEnabled',
    'nodes_compute',
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
      <Title headingLevel="h2">
        Review your ROSA cluster
      </Title>
      <ReviewSection title="Accounts and roles" initiallyExpanded={false}>
        {ReviewItem({ name: 'associated_aws_id', formValues })}
        {ReviewItem({ name: 'installer_role_arn', formValues })}
        {ReviewItem({ name: 'support_role_arn', formValues })}
        {ReviewItem({ name: 'control_plane_role_arn', formValues })}
        {ReviewItem({ name: 'worker_role_arn', formValues })}
      </ReviewSection>
      <ReviewSection title="Cluster settings">
        {clusterSettingsFields.map(name => ReviewItem({ name, formValues }))}
      </ReviewSection>
      <ReviewSection title="Networking">
        {ReviewItem({ name: 'network_configuration_toggle', formValues })}
        { formValues.network_configuration_toggle === 'advanced' && (
          <>
            {ReviewItem({ name: 'network_machine_cidr', formValues })}
            {ReviewItem({ name: 'network_service_cidr', formValues })}
            {ReviewItem({ name: 'network_pod_cidr', formValues })}
            {ReviewItem({ name: 'network_host_prefix', formValues })}
            {ReviewItem({ name: 'cluster_privacy', formValues })}
          </>
        )}
      </ReviewSection>
      <ReviewSection title="Default machine pool">
        {ReviewItem({ name: 'machine_type', formValues })}
        {autoscalingEnabled
          ? ReviewItem({ name: 'min_replicas', formValues })
          : ReviewItem({ name: 'nodes_compute', formValues })}
        {autoscalingEnabled
        && !(formValues.node_labels.length === 1 && isEmpty(formValues.node_labels[0]))
        && ReviewItem({ name: 'node_labels', formValues })}
      </ReviewSection>
      <ReviewSection title="Updates">
        {ReviewItem({ name: 'upgrade_policy', formValues })}
        {formValues.upgrade_policy === 'automatic' && ReviewItem({ name: 'automatic_upgrade_schedule', formValues })}
        {ReviewItem({ name: 'node_drain_grace_period', formValues })}
      </ReviewSection>
    </div>
  );
}
ReviewClusterScreen.propTypes = {
  formValues: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  ),
  isPending: PropTypes.bool,
  canAutoScale: PropTypes.bool,
  autoscalingEnabled: PropTypes.bool,
};

export default ReviewClusterScreen;
