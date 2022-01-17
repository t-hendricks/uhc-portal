import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import {
  DescriptionList,
  DescriptionListTerm,
  DescriptionListDescription,
  DescriptionListGroup,
  Title,
  Bullseye,
  Stack,
  StackItem,
  Spinner,
} from '@patternfly/react-core';

import reviewValues from './reviewValues';
import DebugClusterRequest from '../../DebugClusterRequest';
import config from '../../../../../config';

import './ReviewClusterScreen.scss';

function clusterSpecDescriptionItem({ name, formValues }) {
  const reviewValue = reviewValues[name];
  let value = formValues[name];

  if (!reviewValue) {
    return (
      <DescriptionListGroup>
        <DescriptionListTerm>
          {name}
        </DescriptionListTerm>
        <DescriptionListDescription>
          {value}
        </DescriptionListDescription>
      </DescriptionListGroup>
    );
  }

  if (reviewValue.isBoolean && value === undefined) {
    value = 'false';
  }

  let displayValue;
  if (reviewValue.values && reviewValue.values[value]) {
    displayValue = reviewValue.values[value];
  } else if (reviewValue.valueTransform) {
    displayValue = reviewValue.valueTransform(value, formValues);
  } else {
    displayValue = value;
  }

  return (
    <DescriptionListGroup key={name}>
      <DescriptionListTerm>
        {reviewValue.title}
      </DescriptionListTerm>
      <DescriptionListDescription>
        {displayValue}
      </DescriptionListDescription>
    </DescriptionListGroup>
  );
}

function ReviewClusterScreen({
  clusterRequestParams,
  formValues,
  showVPCCheckbox,
  canAutoScale,
  autoscalingEnabled,
  isPending,
}) {
  const isByoc = formValues.byoc === 'true';
  const isAWS = formValues.cloud_provider === 'aws';
  const isGCP = formValues.cloud_provider === 'gcp';
  const clusterSettingsFields = [
    'cloud_provider', 'name', 'cluster_version', 'region', 'multi_az',
    !isByoc && 'persistent_storage',
    !isByoc && 'load_balancers',
    isByoc && isAWS && 'disable_scp_checks',
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

  const listOptions = {
    // default vertical good for narrow screens, horizontal clearer when we have the space.
    orientation: {
      sm: 'horizontal',
    },
  };
  return (
    <div className="ocm-create-osd-review-screen">
      <Title headingLevel="h2" className="pf-u-pb-md">
        Review your dedicated cluster
      </Title>
      <Title headingLevel="h3">Billing Model</Title>
      <DescriptionList {...listOptions}>
        {clusterSpecDescriptionItem({ name: 'billing_model', formValues })}
        {clusterSpecDescriptionItem({ name: 'byoc', formValues })}
      </DescriptionList>
      <Title headingLevel="h3">
        Cluster settings
      </Title>
      <DescriptionList {...listOptions}>
        {clusterSettingsFields.map(name => clusterSpecDescriptionItem({ name, formValues }))}
      </DescriptionList>
      <Title headingLevel="h3">
        Default machine pool
      </Title>
      <DescriptionList {...listOptions}>
        {clusterSpecDescriptionItem({ name: 'machine_type', formValues })}
        {canAutoScale && clusterSpecDescriptionItem({ name: 'autoscalingEnabled', formValues })}
        {autoscalingEnabled
          ? clusterSpecDescriptionItem({ name: 'min_replicas', formValues })
          : clusterSpecDescriptionItem({ name: 'nodes_compute', formValues })}
        {!(formValues.node_labels.length === 1 && isEmpty(formValues.node_labels[0]))
        && clusterSpecDescriptionItem({ name: 'node_labels', formValues })}
      </DescriptionList>
      <Title headingLevel="h3">
        Networking
      </Title>
      <DescriptionList {...listOptions}>
        {clusterSpecDescriptionItem({ name: 'cluster_privacy', formValues })}
        {showVPCCheckbox && clusterSpecDescriptionItem({ name: 'install_to_vpc', formValues })}
        {showVPCCheckbox && formValues.cluster_privacy === 'internal'
        && clusterSpecDescriptionItem({ name: 'use_privatelink', formValues })}
        {showVPCCheckbox && formValues.install_to_vpc && isAWS && clusterSpecDescriptionItem({ name: 'aws_vpc', formValues })}
        {showVPCCheckbox && formValues.install_to_vpc && isGCP && clusterSpecDescriptionItem({ name: 'gpc_vpc', formValues })}
        {clusterSpecDescriptionItem({ name: 'network_machine_cidr', formValues })}
        {clusterSpecDescriptionItem({ name: 'network_service_cidr', formValues })}
        {clusterSpecDescriptionItem({ name: 'network_pod_cidr', formValues })}
        {clusterSpecDescriptionItem({ name: 'network_host_prefix', formValues })}
      </DescriptionList>
      <Title headingLevel="h3">
        Updates
      </Title>
      <DescriptionList {...listOptions}>
        {clusterSpecDescriptionItem({ name: 'upgrade_policy', formValues })}
        {formValues.upgrade_policy === 'automatic' && clusterSpecDescriptionItem({ name: 'automatic_upgrade_schedule', formValues })}
        {clusterSpecDescriptionItem({ name: 'node_drain_grace_period', formValues })}
      </DescriptionList>

      {config.fakeOSD && <DebugClusterRequest {...clusterRequestParams} /> }
    </div>
  );
}
ReviewClusterScreen.propTypes = {
  clusterRequestParams: PropTypes.object.isRequired,
  formValues: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  ),
  showVPCCheckbox: PropTypes.bool,
  isPending: PropTypes.bool,
  canAutoScale: PropTypes.bool,
  autoscalingEnabled: PropTypes.bool,
};

export default ReviewClusterScreen;
