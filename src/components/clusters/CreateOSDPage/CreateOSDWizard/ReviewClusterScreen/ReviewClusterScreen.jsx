import React from 'react';
import PropTypes from 'prop-types';
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

function ReviewClusterSecreen({ formValues, isPending }) {
  const clusterSettingsFields = [
    'cloud_provider', 'name', 'region', 'multi_az', 'persistent_storage',
    'load_balancers', 'upgrade_policy', 'node_drain_grace_period', 'etcd_encryption',
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
      <Title headingLevel="h2">
        Review your dedicated cluster
      </Title>
      <Title headingLevel="h3">Billing Model</Title>
      <DescriptionList isHorizontal>
        {clusterSpecDescriptionItem({ name: 'billing_model', formValues })}
        {clusterSpecDescriptionItem({ name: 'byoc', formValues })}
      </DescriptionList>
      <Title headingLevel="h3">
        Cluster settings
      </Title>
      <DescriptionList isHorizontal>
        {clusterSettingsFields.map(name => clusterSpecDescriptionItem({ name, formValues }))}
      </DescriptionList>
      <Title headingLevel="h3">
        Networking
      </Title>
      <DescriptionList isHorizontal>
        {clusterSpecDescriptionItem({ name: 'network_configuration_toggle', formValues })}
        { formValues.network_configuration_toggle === 'advanced' && (
          <>
            {clusterSpecDescriptionItem({ name: 'network_machine_cidr', formValues })}
            {clusterSpecDescriptionItem({ name: 'network_service_cidr', formValues })}
            {clusterSpecDescriptionItem({ name: 'network_pod_cidr', formValues })}
            {clusterSpecDescriptionItem({ name: 'network_host_prefix', formValues })}
            {clusterSpecDescriptionItem({ name: 'cluster_privacy', formValues })}
          </>
        )}
      </DescriptionList>
      <Title headingLevel="h3">
        Default machine pool
      </Title>
      <DescriptionList isHorizontal>
        {clusterSpecDescriptionItem({ name: 'machine_type', formValues })}
        {/* TODO: human readable machineType */}
        {clusterSpecDescriptionItem({ name: 'autoscalingEnabled', formValues })}
        {/* TODO: autoscaling details */}
        {clusterSpecDescriptionItem({ name: 'nodes_compute', formValues })}
      </DescriptionList>
    </div>
  );
}
ReviewClusterSecreen.propTypes = {
  formValues: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  ),
  isPending: PropTypes.bool,
};

export default ReviewClusterSecreen;
