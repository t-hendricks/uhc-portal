import React from 'react';
import { Grid, GridItem, LabelGroup, Label } from '@patternfly/react-core';
import { IMDSType } from '~/components/clusters/wizards/common';
import { billingModels } from '../../../../../common/subscriptionTypes';
import { humanizeValueWithUnitGiB } from '../../../../../common/units';
import parseUpdateSchedule from '../../../common/Upgrades/parseUpdateSchedule';
import AwsVpcTable from './AwsVpcTable';

/**
 * reviewValues structure - key: field name
 * {
 *  title - human readable title
 *  values - map from values to human readable strings. optional.
 *           when both `values` and `valueTransform` are unspecified, actual value is shown.
 *  valueTransform - function to transform current value to human readable string,
 *                   gets two parameters: value (current value), allValues (all form values)
 *                   executed when `values` is not defined,
 *                   or when `values` has no entry for the provided value. optional.
 *  isBoolean - when set to `true`, value `undefined` will be treated as `false`,
 *             to match the behaviour of a boolean field.
 *  isMonospace - when set to `true`, value will be shown in monospace font.
 *  isOptional - when set to `true`, the field will only be shown when the value is not falsy.
 *  isExpandable: when set to `true`, the field will be expandable
 *    - initiallyExpanded: optionally set this when isExpandable is set to `true`.
 *      Determines if the section is initially expanded.
 * }
 */
const reviewValues = {
  billing_model: {
    title: 'Subscription type',
    values: {
      [billingModels.STANDARD]: 'Annual: Fixed capacity subscription from Red Hat',
      [billingModels.MARKETPLACE]:
        'On-Demand: Flexible usage billed through the Red Hat Marketplace',
      'standard-trial': 'Free trial (upgradeable)',
    },
  },
  byoc: {
    title: 'Infrastructure type',
    isBoolean: true,
    values: {
      // note: keys here are strings, on purpose, to match redux-form behaviour
      true: 'Customer cloud subscription',
      false: 'Red Hat cloud account',
    },
  },
  disable_scp_checks: {
    title: 'AWS service control policy (SCP) checks',
    valueTransform: (value) => (value ? 'Disabled' : 'Enabled'),
  },
  cloud_provider: {
    title: 'Cloud provider',
    valueTransform: (value) => value?.toUpperCase(),
  },
  name: {
    title: 'Cluster name',
  },
  rosa_roles_provider_creation_mode: {
    title: 'Operator roles and OIDC provider mode',
  },
  byo_oidc_config_id: {
    title: 'OIDC Configuration ID',
  },
  byo_oidc_config_id_managed: {
    title: 'OIDC Configuration Type',
    isBoolean: true,
    values: {
      true: 'Red Hat managed',
      false: 'Self-managed',
    },
  },
  custom_operator_roles_prefix: {
    title: 'Operator roles prefix',
  },
  cluster_version: {
    title: 'Version',
    valueTransform: (value) => value?.raw_id,
  },
  hypershift: {
    title: 'Control plane',
    isBoolean: true,
    values: { true: 'Hosted', false: 'Classic' },
  },
  region: {
    title: 'Region',
  },
  multi_az: {
    title: 'Availability',
    isBoolean: true,
    values: {
      true: 'Multi-zone',
      false: 'Single zone',
    },
  },
  persistent_storage: {
    title: 'Persistent storage',
    valueTransform: (value) => {
      const humanized = humanizeValueWithUnitGiB(parseFloat(value));
      return `${humanized.value} GiB`;
    },
  },
  load_balancers: {
    title: 'Load balancers',
  },
  enable_user_workload_monitoring: {
    title: 'User workload monitoring',
    isBoolean: true,
    values: {
      true: 'Enabled',
      false: 'Disabled',
    },
  },
  upgrade_policy: {
    title: 'Update strategy',
    valueTransform: (value) => (value === 'manual' ? 'Individual updates' : 'Recurring updates'),
  },
  automatic_upgrade_schedule: {
    title: 'Recurring update schedule',
    valueTransform: (value) => {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const hours = [...Array(24).keys()].map((hour) => `${hour.toString().padStart(2, 0)}:00`);
      const [hour, day] = parseUpdateSchedule(value);
      return `Every ${days[day]} at ${hours[hour]} UTC`;
    },
  },
  node_drain_grace_period: {
    title: 'Node draining',
    valueTransform: (value) => `${value} minutes`,
  },
  etcd_encryption: {
    title: 'Additional etcd encryption',
    isBoolean: true,
    values: {
      true: 'Enabled',
      false: 'Disabled',
    },
  },
  fips: {
    title: 'FIPS cryptography',
    isBoolean: true,
    values: {
      true: 'Enabled',
      false: 'Disabled',
    },
  },
  etcd_key_arn: {
    title: 'Etcd encryption key ARN',
  },
  customer_managed_key: {
    title: 'Encrypt volumes with customer keys',
    isBoolean: true,
    values: {
      true: 'Enabled',
      false: 'Disabled',
    },
  },
  network_configuration_toggle: {
    title: 'Networking',
    values: {
      basic: 'Basic',
      advanced: 'Advanced',
    },
  },
  machine_type: {
    title: 'Node instance type',
  },
  autoscalingEnabled: {
    title: 'Autoscaling',
    isBoolean: true,
    values: {
      true: 'Enabled',
      false: 'Disabled',
    },
  },
  imds: {
    title: 'Instance Metadata Service (IMDS)',
    values: {
      [IMDSType.V1AndV2]: 'IMDSv1 and IMDSv2',
      [IMDSType.V2Only]: 'IMDSv2 only',
    },
  },
  nodes_compute: {
    title: 'Compute node count',
    valueTransform: (value, allValues) => {
      if (allValues.multi_az === 'true' && allValues.hypershift !== 'true') {
        return `${value / 3} (× 3 zones = ${value} compute nodes)`;
      }
      return value;
    },
  },
  worker_volume_size_gib: {
    title: 'Worker root disk size',
    valueTransform: (value) => `${value} GiB`,
  },
  min_replicas: {
    title: 'Compute node range',
    valueTransform: (value, allValues) => (
      <>
        <span>
          Minimum nodes
          {allValues.hypershift === 'true' ? ' per machine pool' : ''}
          {allValues.multi_az === 'true' && allValues.hypershift !== 'true' ? ' per zone' : ''}:
        </span>{' '}
        {value || 0}
        <span className="pf-u-ml-lg">
          Maximum nodes
          {allValues.hypershift === 'true' ? ' per machine pool' : ''}
          {allValues.multi_az === 'true' && allValues.hypershift !== 'true' ? ' per zone' : ''}:
        </span>{' '}
        {allValues.max_replicas || 0}
      </>
    ),
  },
  node_labels: {
    title: 'Node labels',
    valueTransform: (labels) => (
      <LabelGroup>
        {
          // eslint-disable-next-line react/destructuring-assignment
          labels.map((label) => (
            <Label color="blue">{`${label.key} = ${label.value || ''}`}</Label>
          ))
        }
      </LabelGroup>
    ),
  },
  // For non-Hypershift
  install_to_vpc: {
    title: 'Install into existing VPC',
    isBoolean: true,
    values: {
      true: 'Enabled',
      false: 'Disabled',
    },
  },
  // For Hypershift
  selected_vpc_id: {
    title: 'Install to selected VPC',
  },
  use_privatelink: {
    title: 'PrivateLink',
    isBoolean: true,
    values: {
      true: 'Enabled',
      false: 'Disabled',
    },
  },
  shared_vpc: {
    title: 'Shared VPC settings',
    valueTransform: (sharedVpcSettings) => (
      <Grid>
        {/* Three columns to match the layout of VPC subnet settings */}
        <GridItem md={3}>
          <strong>Base DNS domain</strong>
        </GridItem>
        <GridItem md={3}>
          <strong>Private hosted zone ID</strong>
        </GridItem>
        <GridItem md={3}>
          <strong>Shared VPC role</strong>
        </GridItem>
        <GridItem />
        <GridItem md={3}>{sharedVpcSettings.base_dns_domain}</GridItem>
        <GridItem md={3}>{sharedVpcSettings.hosted_zone_id}</GridItem>
        <GridItem md={3}>{sharedVpcSettings.hosted_zone_role_arn}</GridItem>
        <GridItem />
      </Grid>
    ),
  },
  aws_standalone_vpc: {
    title: 'VPC subnet settings',
    valueTransform: (value, allValues) => {
      let vpcs = [
        {
          az: allValues.az_0,
          privateSubnet: allValues.private_subnet_id_0,
          publicSubnet: allValues.public_subnet_id_0,
        },
      ];
      if (allValues.multi_az === 'true') {
        vpcs = [
          ...vpcs,
          {
            az: allValues.az_1,
            privateSubnet: allValues.private_subnet_id_1,
            publicSubnet: allValues.public_subnet_id_1,
          },
          {
            az: allValues.az_2,
            privateSubnet: allValues.private_subnet_id_2,
            publicSubnet: allValues.public_subnet_id_2,
          },
        ];
      }

      const showPublicFields = !allValues.use_privatelink;
      return <AwsVpcTable vpcs={vpcs} showPublicFields={showPublicFields} />;
    },
  },
  aws_hosted_machine_pools: {
    title: 'Machine pools',
    valueTransform: (value, allValues) => {
      const vpcs = allValues.machine_pools_subnets.map((machinePool) => ({
        publicSubnet: '',
        privateSubnet: machinePool.name || machinePool.subnet_id,
        az: machinePool.availability_zone,
      }));
      return <AwsVpcTable vpcs={vpcs} showPublicFields={false} />;
    },
  },
  applicationIngress: {
    title: 'Application ingress',
    valueTransform: (value) => (value === 'default' ? 'Use default settings' : 'Custom settings'),
  },
  defaultRouterSelectors: {
    title: 'Route selectors',
    valueTransform: (value) => value || 'None specified',
  },
  defaultRouterExcludedNamespacesFlag: {
    title: 'Excluded namespaces',
    valueTransform: (value) => value || 'None specified',
  },
  isDefaultRouterWildcardPolicyAllowed: {
    title: 'Wildcard policy',
    valueTransform: (value) => (value ? 'Allowed' : 'Disallowed'),
  },
  isDefaultRouterNamespaceOwnershipPolicyStrict: {
    title: 'Namespace ownership policy',
    valueTransform: (value) => (value ? 'Strict' : 'Inter-namespace ownership'),
  },
  gpc_vpc: {
    title: 'VPC subnet settings',
    valueTransform: (value, allValues) => (
      <Grid>
        <GridItem md={3}>
          <strong>Existing VPC name</strong>
        </GridItem>
        <GridItem md={3}>
          <strong>Control plane subnet name</strong>
        </GridItem>
        <GridItem md={3}>
          <strong>Compute subnet name</strong>
        </GridItem>
        <GridItem md={3} />
        <GridItem md={3}>{allValues.vpc_name}</GridItem>
        <GridItem md={3}>{allValues.control_plane_subnet}</GridItem>
        <GridItem md={3}>{allValues.compute_subnet}</GridItem>
        <GridItem md={3} />
      </Grid>
    ),
  },
  configure_proxy: {
    title: 'Cluster-wide proxy',
    isBoolean: true,
    values: {
      true: 'Enabled',
      false: 'Disabled',
    },
  },
  http_proxy_url: {
    title: 'HTTP proxy URL',
    isOptional: true,
  },
  https_proxy_url: {
    title: 'HTTPS proxy URL',
    isOptional: true,
  },
  no_proxy_domains: {
    title: 'No Proxy domains',
    isOptional: true,
    valueTransform: (noProxyDomains) => (
      <LabelGroup>
        {/* eslint-disable-next-line react/destructuring-assignment */}
        {noProxyDomains.map((domain) => (
          <Label isCompact color="blue">
            {domain}
          </Label>
        ))}
      </LabelGroup>
    ),
  },
  additional_trust_bundle: {
    title: 'Additional trust bundle',
    isMonospace: true,
    isOptional: true,
    isExpandable: true,
    initiallyExpanded: false,
  },
  network_machine_cidr: {
    title: 'Machine CIDR',
  },
  network_service_cidr: {
    title: 'Service CIDR',
  },
  network_pod_cidr: {
    title: 'Pod CIDR',
  },
  network_host_prefix: {
    title: 'Host prefix',
    valueTransform: (value) => (value?.includes('/') ? value : `/${value}`),
  },
  cluster_privacy: {
    title: 'Cluster privacy',
    values: {
      external: 'Public',
      internal: 'Private',
      undefined: 'Public',
    },
  },
  cluster_privacy_public_subnet: {
    title: 'Public subnet',
    valueTransform: (subnet) => subnet.name || subnet.subnet_id,
  },
  associated_aws_id: {
    title: 'AWS infrastructure account ID',
  },
  billing_account_id: {
    title: 'AWS billing account ID',
  },
  installer_role_arn: {
    title: 'Installer role',
  },
  support_role_arn: {
    title: 'Support role ARN',
  },
  worker_role_arn: {
    title: 'Compute role',
  },
  control_plane_role_arn: {
    title: 'Control plane role',
  },
};

export default reviewValues;
