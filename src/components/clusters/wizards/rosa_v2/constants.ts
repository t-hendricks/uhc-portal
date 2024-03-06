import { FormikTouched, FormikValues } from 'formik';
import { FieldId as CommonFieldId } from '~/components/clusters/wizards/common/constants';
import {
  HOST_PREFIX_DEFAULT,
  MACHINE_CIDR_DEFAULT,
  POD_CIDR_DEFAULT,
  SERVICE_CIDR_DEFAULT,
} from '~/components/clusters/common/networkingConstants';
import { emptyAWSSubnet } from '../common/createOSDInitialValues';

export enum RosaFieldId {
  Hypershift = 'hypershift',
  AssociatedAwsId = 'associated_aws_id',
  BillingAccountId = 'billing_account_id',
  SupportRoleArn = 'support_role_arn',
  WorkerRoleArn = 'worker_role_arn',
  ControlPlaneRoleArn = 'control_plane_role_arn',
  RosaMaxOsVersion = 'rosa_max_os_version',
  UsePrivatelink = 'use_privatelink',
  SharedVpc = 'shared_vpc',
  DetectedOcmAndUserRoles = 'detected_ocm_and_user_roles',
  EtcdKeyArn = 'etcd_key_arn',
  CloudProviderId = 'cloud_provider',
  Imds = 'imds',
  ClusterPrivacy = 'cluster_privacy',
  ClusterPrivacyPublicSubnetId = 'cluster_privacy_public_subnet_id',
  WorkerVolumeSizeGib = 'worker_volume_size_gib',
}

export const FieldId = { ...CommonFieldId, ...RosaFieldId };

export enum StepName {
  AccountsAndRoles = 'Accounts and roles',
  ClusterSettings = 'Cluster settings',
  Details = 'Details',
  MachinePool = 'Machine pool',
  Networking = 'Networking',
  Configuration = 'Configuration',
  VpcSettings = 'VPC settings',
  ClusterProxy = 'Cluster-wide proxy',
  CidrRanges = 'CIDR ranges',
  ClusterRolesAndPolicies = 'Cluster roles and policies',
  ClusterUpdates = 'Cluster updates',
  Review = 'Review and create',
}

export enum StepId {
  AccountsAndRoles = 'accounts-and-roles',
  ClusterSettings = 'cluster-settings',
  ClusterSettingsDetails = 'cluster-settings-details',
  ClusterSettingsMachinePool = 'cluster-settings-machine-pool',
  Networking = 'networking',
  NetworkingConfiguration = 'networking-config',
  NetworkingVpcSettings = 'networking-vpc-settings',
  NetworkingClusterProxy = 'networking-cluster-proxy',
  NetworkingCidrRanges = 'networking-cidr-ranges',
  ClusterRolesAndPolicies = 'cluster-roles-and-policies',
  ClusterUpdates = 'cluster-updates',
  Review = 'review',
}

const hypershiftDefaultSelected = true;

export const initialValues: FormikValues = {
  [FieldId.Hypershift]: `${hypershiftDefaultSelected}`,
  [FieldId.MultiAz]: 'false',
  [FieldId.EnableUserWorkloadMonitoring]: true,
  [FieldId.CustomerManagedKey]: 'false',
  [FieldId.KmsKeyArn]: '',
  [FieldId.EtcdEncryption]: false,
  [FieldId.EtcdKeyArn]: '',
  [FieldId.FipsCryptography]: false,
  // CIDR SECTION FOLLOWS
  [FieldId.CidrDefaultValuesToggle]: true,
  [FieldId.NetworkMachineCidr]: MACHINE_CIDR_DEFAULT,
  [FieldId.NetworkServiceCidr]: SERVICE_CIDR_DEFAULT,
  [FieldId.NetworkPodCidr]: POD_CIDR_DEFAULT,
  [FieldId.NetworkHostPrefix]: HOST_PREFIX_DEFAULT,
  [FieldId.MachinePoolsSubnets]: [emptyAWSSubnet()],
};

export const initialValuesRestrictedEnv: FormikValues = {
  ...initialValues,
  [FieldId.EtcdEncryption]: true,
  [FieldId.FipsCryptography]: true,
};

export const initialTouched: FormikTouched<FormikValues> = {
  [FieldId.Hypershift]: hypershiftDefaultSelected,
};

export const testCIDRInitialValues = {
  hypershift: 'false',
  install_to_vpc: false,
  shared_vpc: {
    is_allowed: true,
    is_selected: false,
    base_dns_domain: '',
    hosted_zone_id: '',
    hosted_zone_role_arn: '',
  },
  configure_proxy: false,
  machinePoolsSubnets: [
    {
      availabilityZone: '',
      privateSubnetId: '',
      publicSubnetId: '',
    },
  ],
  cloud_provider: 'aws',
  product: 'ROSA',
  byoc: 'true',
  associated_aws_id: '000000000006',
  installer_role_arn: 'arn:aws:iam::000000000006:role/ManagedOpenShift-Installer-Role',
  support_role_arn: 'arn:aws:iam::000000000006:role/ManagedOpenShift-Support-Role',
  worker_role_arn: 'arn:aws:iam::000000000006:role/ManagedOpenShift-Worker-Role',
  control_plane_role_arn: 'arn:aws:iam::000000000006:role/ManagedOpenShift-ControlPlane-Role',
  rosa_max_os_version: '4.14',
  node_drain_grace_period: 60,
  upgrade_policy: 'manual',
  automatic_upgrade_schedule: '0 0 * * 0',
  multi_az: 'false',
  persistent_storage: '107374182400',
  load_balancers: '0',
  nodes_compute: 2,
  node_labels: [{}],
  name: 're-test',
  dns_base_domain: '',
  aws_access_key_id: '',
  aws_secret_access_key: '',
  network_configuration_toggle: 'basic',
  cluster_privacy: 'external',
  use_privatelink: false,
  disable_scp_checks: false,
  billing_model: 'standard',
  cluster_autoscaling: {
    balance_similar_node_groups: false,
    balancing_ignored_labels: '',
    skip_nodes_with_local_storage: true,
    log_verbosity: 1,
    ignore_daemonsets_utilization: false,
    max_node_provision_time: '15m',
    max_pod_grace_period: 600,
    pod_priority_threshold: -10,
    resource_limits: {
      max_nodes_total: 180,
      cores: {
        min: 0,
        max: 11520,
      },
      memory: {
        min: 0,
        max: 230400,
      },
      gpus: '',
    },
    scale_down: {
      enabled: true,
      delay_after_add: '10m',
      delay_after_delete: '0s',
      delay_after_failure: '3m',
      utilization_threshold: '0.5',
      unneeded_time: '10m',
    },
  },
  imds: 'optional',
  etcd_encryption: false,
  fips: false,
  applicationIngress: 'default',
  defaultRouterSelectors: '',
  defaultRouterExcludedNamespacesFlag: '',
  isDefaultRouterWildcardPolicyAllowed: false,
  isDefaultRouterNamespaceOwnershipPolicyStrict: true,
  selected_vpc: {
    id: '',
    name: '',
  },
  securityGroups: {
    applyControlPlaneToAll: true,
    controlPlane: [],
    infra: [],
    worker: [],
  },
  enable_user_workload_monitoring: 'true',
  worker_volume_size_gib: 300,
  region: 'us-east-1',
  customer_managed_key: 'false',
  cluster_version: {
    kind: 'Version',
    id: 'openshift-v4.14.12',
    href: '/api/clusters_mgmt/v1/versions/openshift-v4.14.12',
    raw_id: '4.14.12',
    enabled: true,
    default: true,
    channel_group: 'stable',
    rosa_enabled: true,
    hosted_control_plane_enabled: true,
    hosted_control_plane_default: true,
    gcp_marketplace_enabled: true,
    end_of_life_timestamp: '2025-02-28T00:00:00Z',
    image_overrides: {
      aws: [
        {
          product: {
            kind: 'ProductLink',
            id: 'rosa',
            href: '/api/clusters_mgmt/v1/products/rosa',
          },
          region: {
            kind: 'CloudRegionLink',
            id: 'sa-east-1',
            href: '/api/clusters_mgmt/v1/cloud_providers/aws/regions/sa-east-1',
          },
          ami: 'ami-0ea74c113800ca0d2',
        },
        {
          product: {
            kind: 'ProductLink',
            id: 'rosa',
            href: '/api/clusters_mgmt/v1/products/rosa',
          },
          region: {
            kind: 'CloudRegionLink',
            id: 'eu-central-1',
            href: '/api/clusters_mgmt/v1/cloud_providers/aws/regions/eu-central-1',
          },
          ami: 'ami-06e39a701e2b23dd5',
        },
        {
          product: {
            kind: 'ProductLink',
            id: 'rosa',
            href: '/api/clusters_mgmt/v1/products/rosa',
          },
          region: {
            kind: 'CloudRegionLink',
            id: 'us-west-1',
            href: '/api/clusters_mgmt/v1/cloud_providers/aws/regions/us-west-1',
          },
          ami: 'ami-04eda993afcf68041',
        },
        {
          product: {
            kind: 'ProductLink',
            id: 'rosa',
            href: '/api/clusters_mgmt/v1/products/rosa',
          },
          region: {
            kind: 'CloudRegionLink',
            id: 'me-south-1',
            href: '/api/clusters_mgmt/v1/cloud_providers/aws/regions/me-south-1',
          },
          ami: 'ami-02d91107af59d29a2',
        },
        {
          product: {
            kind: 'ProductLink',
            id: 'rosa',
            href: '/api/clusters_mgmt/v1/products/rosa',
          },
          region: {
            kind: 'CloudRegionLink',
            id: 'ap-northeast-1',
            href: '/api/clusters_mgmt/v1/cloud_providers/aws/regions/ap-northeast-1',
          },
          ami: 'ami-0ec5f732a717b9d7e',
        },
        {
          product: {
            kind: 'ProductLink',
            id: 'rosa',
            href: '/api/clusters_mgmt/v1/products/rosa',
          },
          region: {
            kind: 'CloudRegionLink',
            id: 'ap-east-1',
            href: '/api/clusters_mgmt/v1/cloud_providers/aws/regions/ap-east-1',
          },
          ami: 'ami-0cac00e174222f885',
        },
        {
          product: {
            kind: 'ProductLink',
            id: 'rosa',
            href: '/api/clusters_mgmt/v1/products/rosa',
          },
          region: {
            kind: 'CloudRegionLink',
            id: 'ap-southeast-3',
            href: '/api/clusters_mgmt/v1/cloud_providers/aws/regions/ap-southeast-3',
          },
          ami: 'ami-05ebb895e2d189a92',
        },
        {
          product: {
            kind: 'ProductLink',
            id: 'rosa',
            href: '/api/clusters_mgmt/v1/products/rosa',
          },
          region: {
            kind: 'CloudRegionLink',
            id: 'us-west-2',
            href: '/api/clusters_mgmt/v1/cloud_providers/aws/regions/us-west-2',
          },
          ami: 'ami-0ca469d02b829bed2',
        },
        {
          product: {
            kind: 'ProductLink',
            id: 'rosa',
            href: '/api/clusters_mgmt/v1/products/rosa',
          },
          region: {
            kind: 'CloudRegionLink',
            id: 'ap-northeast-3',
            href: '/api/clusters_mgmt/v1/cloud_providers/aws/regions/ap-northeast-3',
          },
          ami: 'ami-087bfb06897e9e17e',
        },
        {
          product: {
            kind: 'ProductLink',
            id: 'rosa',
            href: '/api/clusters_mgmt/v1/products/rosa',
          },
          region: {
            kind: 'CloudRegionLink',
            id: 'ap-northeast-2',
            href: '/api/clusters_mgmt/v1/cloud_providers/aws/regions/ap-northeast-2',
          },
          ami: 'ami-0144a4f381fc1606c',
        },
        {
          product: {
            kind: 'ProductLink',
            id: 'rosa',
            href: '/api/clusters_mgmt/v1/products/rosa',
          },
          region: {
            kind: 'CloudRegionLink',
            id: 'ap-south-1',
            href: '/api/clusters_mgmt/v1/cloud_providers/aws/regions/ap-south-1',
          },
          ami: 'ami-01347c0f82aa8ccea',
        },
        {
          product: {
            kind: 'ProductLink',
            id: 'rosa',
            href: '/api/clusters_mgmt/v1/products/rosa',
          },
          region: {
            kind: 'CloudRegionLink',
            id: 'ca-central-1',
            href: '/api/clusters_mgmt/v1/cloud_providers/aws/regions/ca-central-1',
          },
          ami: 'ami-03e3d037fa56ba391',
        },
        {
          product: {
            kind: 'ProductLink',
            id: 'rosa',
            href: '/api/clusters_mgmt/v1/products/rosa',
          },
          region: {
            kind: 'CloudRegionLink',
            id: 'ap-southeast-1',
            href: '/api/clusters_mgmt/v1/cloud_providers/aws/regions/ap-southeast-1',
          },
          ami: 'ami-053bbe72294a548d1',
        },
        {
          product: {
            kind: 'ProductLink',
            id: 'rosa',
            href: '/api/clusters_mgmt/v1/products/rosa',
          },
          region: {
            kind: 'CloudRegionLink',
            id: 'ap-southeast-4',
            href: '/api/clusters_mgmt/v1/cloud_providers/aws/regions/ap-southeast-4',
          },
          ami: 'ami-0edf2b052abc2af7d',
        },
        {
          product: {
            kind: 'ProductLink',
            id: 'rosa',
            href: '/api/clusters_mgmt/v1/products/rosa',
          },
          region: {
            kind: 'CloudRegionLink',
            id: 'us-east-2',
            href: '/api/clusters_mgmt/v1/cloud_providers/aws/regions/us-east-2',
          },
          ami: 'ami-04737283ac19b8635',
        },
        {
          product: {
            kind: 'ProductLink',
            id: 'rosa',
            href: '/api/clusters_mgmt/v1/products/rosa',
          },
          region: {
            kind: 'CloudRegionLink',
            id: 'us-gov-west-1',
            href: '/api/clusters_mgmt/v1/cloud_providers/aws/regions/us-gov-west-1',
          },
          ami: 'ami-0ffc34293b8b3b5ad',
        },
        {
          product: {
            kind: 'ProductLink',
            id: 'rosa',
            href: '/api/clusters_mgmt/v1/products/rosa',
          },
          region: {
            kind: 'CloudRegionLink',
            id: 'ap-south-2',
            href: '/api/clusters_mgmt/v1/cloud_providers/aws/regions/ap-south-2',
          },
          ami: 'ami-0b13f44eee5d62cba',
        },
        {
          product: {
            kind: 'ProductLink',
            id: 'rosa',
            href: '/api/clusters_mgmt/v1/products/rosa',
          },
          region: {
            kind: 'CloudRegionLink',
            id: 'eu-south-1',
            href: '/api/clusters_mgmt/v1/cloud_providers/aws/regions/eu-south-1',
          },
          ami: 'ami-037df250c060f1a85',
        },
        {
          product: {
            kind: 'ProductLink',
            id: 'rosa',
            href: '/api/clusters_mgmt/v1/products/rosa',
          },
          region: {
            kind: 'CloudRegionLink',
            id: 'eu-central-2',
            href: '/api/clusters_mgmt/v1/cloud_providers/aws/regions/eu-central-2',
          },
          ami: 'ami-04c6ff1edabf3f212',
        },
        {
          product: {
            kind: 'ProductLink',
            id: 'rosa',
            href: '/api/clusters_mgmt/v1/products/rosa',
          },
          region: {
            kind: 'CloudRegionLink',
            id: 'eu-west-2',
            href: '/api/clusters_mgmt/v1/cloud_providers/aws/regions/eu-west-2',
          },
          ami: 'ami-05c3f2ad7963594f3',
        },
        {
          product: {
            kind: 'ProductLink',
            id: 'rosa',
            href: '/api/clusters_mgmt/v1/products/rosa',
          },
          region: {
            kind: 'CloudRegionLink',
            id: 'eu-west-1',
            href: '/api/clusters_mgmt/v1/cloud_providers/aws/regions/eu-west-1',
          },
          ami: 'ami-0eba9f75078b5554a',
        },
        {
          product: {
            kind: 'ProductLink',
            id: 'rosa',
            href: '/api/clusters_mgmt/v1/products/rosa',
          },
          region: {
            kind: 'CloudRegionLink',
            id: 'ap-southeast-2',
            href: '/api/clusters_mgmt/v1/cloud_providers/aws/regions/ap-southeast-2',
          },
          ami: 'ami-0348c3bd1f92719ae',
        },
        {
          product: {
            kind: 'ProductLink',
            id: 'rosa',
            href: '/api/clusters_mgmt/v1/products/rosa',
          },
          region: {
            kind: 'CloudRegionLink',
            id: 'eu-south-2',
            href: '/api/clusters_mgmt/v1/cloud_providers/aws/regions/eu-south-2',
          },
          ami: 'ami-0f3ad9b25036a95dc',
        },
        {
          product: {
            kind: 'ProductLink',
            id: 'rosa',
            href: '/api/clusters_mgmt/v1/products/rosa',
          },
          region: {
            kind: 'CloudRegionLink',
            id: 'me-central-1',
            href: '/api/clusters_mgmt/v1/cloud_providers/aws/regions/me-central-1',
          },
          ami: 'ami-08984cd1e1423187e',
        },
        {
          product: {
            kind: 'ProductLink',
            id: 'rosa',
            href: '/api/clusters_mgmt/v1/products/rosa',
          },
          region: {
            kind: 'CloudRegionLink',
            id: 'us-east-1',
            href: '/api/clusters_mgmt/v1/cloud_providers/aws/regions/us-east-1',
          },
          ami: 'ami-06f3dda44132a8cc9',
        },
        {
          product: {
            kind: 'ProductLink',
            id: 'rosa',
            href: '/api/clusters_mgmt/v1/products/rosa',
          },
          region: {
            kind: 'CloudRegionLink',
            id: 'us-gov-east-1',
            href: '/api/clusters_mgmt/v1/cloud_providers/aws/regions/us-gov-east-1',
          },
          ami: 'ami-0e037be3a87e73ae0',
        },
        {
          product: {
            kind: 'ProductLink',
            id: 'rosa',
            href: '/api/clusters_mgmt/v1/products/rosa',
          },
          region: {
            kind: 'CloudRegionLink',
            id: 'af-south-1',
            href: '/api/clusters_mgmt/v1/cloud_providers/aws/regions/af-south-1',
          },
          ami: 'ami-0d401016e8a21cecb',
        },
        {
          product: {
            kind: 'ProductLink',
            id: 'rosa',
            href: '/api/clusters_mgmt/v1/products/rosa',
          },
          region: {
            kind: 'CloudRegionLink',
            id: 'eu-north-1',
            href: '/api/clusters_mgmt/v1/cloud_providers/aws/regions/eu-north-1',
          },
          ami: 'ami-0fb33a85b51cb99ef',
        },
        {
          product: {
            kind: 'ProductLink',
            id: 'rosa',
            href: '/api/clusters_mgmt/v1/products/rosa',
          },
          region: {
            kind: 'CloudRegionLink',
            id: 'eu-west-3',
            href: '/api/clusters_mgmt/v1/cloud_providers/aws/regions/eu-west-3',
          },
          ami: 'ami-05967a4e65a8356d9',
        },
      ],
      gcp: [
        {
          product: {
            kind: 'ProductLink',
            id: 'osd',
            href: '/api/clusters_mgmt/v1/products/osd',
          },
          billing_model: {
            kind: 'BillingModel',
            id: 'marketplace-gcp',
            href: '/api/accounts_mgmt/v1/billing_models/marketplace-gcp',
          },
          image_id: 'redhat-coreos-osd-414-x86-64-202310170514',
          project_id: 'redhat-marketplace-dev',
        },
      ],
    },
    release_image:
      'quay.io/openshift-release-dev/ocp-release@sha256:671bc35e8fc2027d6f4c2c756d19909d83d55d1c591e8f9ea790ec8da744d171',
  },
  custom_operator_roles_prefix: 're-test-gl0m',
  machine_type: 'm5.xlarge',
  cidr_default_values_toggle: true,
  network_machine_cidr: MACHINE_CIDR_DEFAULT,
  network_service_cidr: SERVICE_CIDR_DEFAULT,
  network_pod_cidr: POD_CIDR_DEFAULT,
  network_host_prefix: HOST_PREFIX_DEFAULT,
};
