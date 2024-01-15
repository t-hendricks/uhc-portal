import pick from 'lodash/pick';
import isEmpty from 'lodash/isEmpty';

import config from '~/config';

import { store } from '~/redux/store';
import { DEFAULT_FLAVOUR_ID } from '~/redux/actions/flavourActions';
import { createCluster } from '~/redux/actions/clustersActions';
import {
  parseReduxFormKeyValueList,
  strToKeyValueObject,
  stringToArrayTrimmed,
} from '~/common/helpers';
import { billingModels } from '~/common/subscriptionTypes';
import { WildcardPolicy } from '~/types/clusters_mgmt.v1/models/WildcardPolicy';
import { NamespaceOwnershipPolicy } from '~/types/clusters_mgmt.v1/models/NamespaceOwnershipPolicy';
import { ApplicationIngressType } from '~/components/clusters/wizards/osd/Networking/constants';
import { getClusterAutoScalingSubmitSettings } from '~/components/clusters/common/clusterAutoScalingValues';
import { canConfigureDayOneManagedIngress } from '../rosa/constants';
import * as submitRequestHelpers from './submitOSDRequestHelper';

export const createClusterRequest = ({ isWizard = true, cloudProviderID, product }, formData) => {
  const isMultiAz = formData.multi_az === 'true';
  // See submitOSDRequest.test.js for when we get fields vs side params.
  // But to avoid bugs where we ignore user's choices, when both are present, the field should win.
  const actualCloudProviderID = formData.cloud_provider || cloudProviderID;
  const actualProduct = formData.product || product;
  const isHypershiftSelected = formData.hypershift === 'true';
  const state = store.getState();
  const isAWSBillingAccountVisible =
    state.features?.HCP_AWS_BILLING_SHOW !== undefined
      ? state.features?.HCP_AWS_BILLING_SHOW
      : true;

  const clusterRequest = {
    name: formData.name,
    region: {
      id: formData.region,
    },
    nodes: {
      compute_machine_type: {
        id: formData.machine_type,
      },
    },
    managed: true,
    product: {
      id: actualProduct.toLowerCase(),
    },
    cloud_provider: {
      id: actualCloudProviderID,
    },
    multi_az: isMultiAz,
    etcd_encryption: formData.etcd_encryption,
    billing_model: billingModels.STANDARD,
    disable_user_workload_monitoring:
      isHypershiftSelected || !formData.enable_user_workload_monitoring,
    ...(!isHypershiftSelected && { fips: !!formData.fips }),
  };

  if (!isHypershiftSelected) {
    clusterRequest.node_drain_grace_period = {
      value: formData.node_drain_grace_period,
      unit: 'minutes',
    };
  }
  if (isHypershiftSelected) {
    clusterRequest.billing_model = billingModels.MARKETPLACE_AWS;
  } else if (formData.billing_model === billingModels.MARKETPLACE_GCP) {
    clusterRequest.billing_model = billingModels.MARKETPLACE_GCP;
  } else if (formData.billing_model) {
    const [billing] = formData.billing_model.split('-');
    clusterRequest.billing_model = billing;
  } else {
    clusterRequest.billing_model = billingModels.STANDARD;
  }

  if (formData.cluster_version) {
    clusterRequest.version = { id: formData.cluster_version.id };
  }

  if (formData.autoscalingEnabled) {
    const minNodes = parseInt(formData.min_replicas, 10);
    const maxNodes = parseInt(formData.max_replicas, 10);

    if (isHypershiftSelected) {
      clusterRequest.nodes.autoscale_compute = {
        min_replicas: minNodes * formData.machine_pools_subnets.length,
        max_replicas: maxNodes * formData.machine_pools_subnets.length,
      };
    } else {
      clusterRequest.autoscaler = getClusterAutoScalingSubmitSettings(formData.cluster_autoscaling);
      clusterRequest.nodes.autoscale_compute = {
        min_replicas: isMultiAz ? minNodes * 3 : minNodes,
        max_replicas: isMultiAz ? maxNodes * 3 : maxNodes,
      };
    }
  } else {
    clusterRequest.nodes.compute = parseInt(formData.nodes_compute, 10);
  }

  const parsedLabels = parseReduxFormKeyValueList(formData.node_labels);
  if (!isEmpty(parsedLabels)) {
    clusterRequest.nodes.compute_labels = parsedLabels;
  }

  if (config.fakeOSD) {
    clusterRequest.properties = { fake_cluster: 'true' };
  }

  if (isWizard || formData.network_configuration_toggle === 'advanced') {
    clusterRequest.network = {
      machine_cidr: formData.network_machine_cidr,
      service_cidr: formData.network_service_cidr,
      pod_cidr: formData.network_pod_cidr,
      host_prefix: parseInt(formData.network_host_prefix, 10),
    };

    const wasClusterPrivacyShown =
      actualCloudProviderID === 'aws' ||
      (actualCloudProviderID === 'gcp' && formData.byoc === 'true');
    if (wasClusterPrivacyShown) {
      clusterRequest.api = {
        listening: formData.cluster_privacy,
      };
    }
  }

  if (formData.byoc === 'true') {
    const wasExistingVPCShown = isWizard || formData.network_configuration_toggle === 'advanced';
    const isInstallExistingVPC = wasExistingVPCShown && formData.install_to_vpc;
    const configureProxySelected = formData.configure_proxy === true;
    const usePrivateLink = formData.use_privatelink;

    clusterRequest.ccs = {
      enabled: true,
    };
    if (actualCloudProviderID === 'aws') {
      if (actualProduct === 'ROSA') {
        // STS credentials
        clusterRequest.aws = {
          account_id: formData.associated_aws_id,
          sts: {
            role_arn: formData.installer_role_arn,
            support_role_arn: formData.support_role_arn,
            instance_iam_roles: {
              worker_role_arn: formData.worker_role_arn,
              ...(isHypershiftSelected ? {} : { master_role_arn: formData.control_plane_role_arn }),
            },
            operator_role_prefix: formData.custom_operator_roles_prefix,
          },
        };
        // auto mode
        if (formData.rosa_roles_provider_creation_mode === 'auto') {
          clusterRequest.aws.sts = {
            ...clusterRequest.aws.sts,
            auto_mode: true,
          };
        }
        // rosa creator arn
        clusterRequest.properties = {
          ...clusterRequest.properties,
          rosa_creator_arn: formData.rosa_creator_arn,
        };

        // BYO OIDC
        if (formData.byo_oidc_config_id) {
          clusterRequest.aws.sts.oidc_config = {
            id: formData.byo_oidc_config_id,
          };
        }

        // Worker volume size
        if (formData.worker_volume_size_gib) {
          clusterRequest.nodes.compute_root_volume = {
            aws: {
              size: formData.worker_volume_size_gib,
            },
          };
        }

        if (isInstallExistingVPC && !isHypershiftSelected) {
          // Shared VPC
          const sharedVpc = formData.shared_vpc;
          if (sharedVpc.is_selected) {
            clusterRequest.aws = {
              ...clusterRequest.aws,
              private_hosted_zone_id: sharedVpc.hosted_zone_id,
              private_hosted_zone_role_arn: sharedVpc.hosted_zone_role_arn,
            };
            clusterRequest.dns = {
              base_domain: sharedVpc.base_dns_domain,
            };
          }
        }
      } else {
        // AWS CCS credentials
        clusterRequest.aws = {
          access_key_id: formData.access_key_id,
          account_id: formData.account_id,
          secret_access_key: formData.secret_access_key,
        };
      }

      // Security groups
      const sgParams = submitRequestHelpers.createSecurityGroupsParams(formData.securityGroups);
      if (isInstallExistingVPC && !isHypershiftSelected && sgParams) {
        clusterRequest.aws = {
          ...clusterRequest.aws,
          ...sgParams,
        };
      }

      if (usePrivateLink) {
        clusterRequest.aws.private_link = true;
      }
      if (formData.customer_managed_key === 'true') {
        clusterRequest.aws.kms_key_arn = formData.kms_key_arn;
      }

      if (isHypershiftSelected) {
        if (formData.etcd_key_arn) {
          clusterRequest.aws.etcd_encryption = {
            kms_key_arn: formData.etcd_key_arn,
          };
        }
        if (isAWSBillingAccountVisible) {
          clusterRequest.aws.billing_account_id = formData.billing_account_id;
        }
      }

      if (formData.imds && !isHypershiftSelected) {
        // ROSA Classic and OSD CCS only
        clusterRequest.aws.ec2_metadata_http_tokens = formData.imds;
      }

      clusterRequest.ccs.disable_scp_checks = formData.disable_scp_checks;
      clusterRequest.aws.subnet_ids = submitRequestHelpers.createClusterAwsSubnetIds({
        formData,
        isInstallExistingVPC,
      });
      clusterRequest.nodes.availability_zones = submitRequestHelpers.createClusterAzs({
        formData,
        isInstallExistingVPC,
      });
    } else if (actualCloudProviderID === 'gcp') {
      const parsed = JSON.parse(formData.gcp_service_account);
      clusterRequest.gcp = pick(parsed, [
        'type',
        'project_id',
        'private_key_id',
        'private_key',
        'client_email',
        'client_id',
        'auth_uri',
        'token_uri',
        'auth_provider_x509_cert_url',
        'client_x509_cert_url',
      ]);
      clusterRequest.gcp.security = {
        secure_boot: formData.secure_boot,
      };
      clusterRequest.cloud_provider.display_name = 'gcp';
      clusterRequest.cloud_provider.name = 'gcp';
      clusterRequest.flavour = {
        id: DEFAULT_FLAVOUR_ID,
      };
      if (isInstallExistingVPC) {
        clusterRequest.gcp_network = {
          vpc_name: formData.vpc_name,
          control_plane_subnet: formData.control_plane_subnet,
          compute_subnet: formData.compute_subnet,
        };
        if (formData.install_to_shared_vpc) {
          clusterRequest.gcp_network.vpc_project_id = formData.shared_host_project_id;
        }
      }
      if (formData.customer_managed_key === 'true') {
        clusterRequest.gcp_encryption_key = {
          key_name: formData.key_name,
          key_ring: formData.key_ring,
          key_location: formData.key_location,
          kms_key_service_account: formData.kms_service_account,
        };
      }
    }

    // For ROSA, GCP and AWS OSD with byoc
    if (
      formData.applicationIngress === ApplicationIngressType.Custom &&
      canConfigureDayOneManagedIngress(formData.cluster_version?.raw_id)
    ) {
      clusterRequest.ingresses = {
        items: [
          {
            default: true,
            excluded_namespaces: formData.defaultRouterExcludedNamespacesFlag
              ? stringToArrayTrimmed(formData.defaultRouterExcludedNamespacesFlag)
              : undefined,
            route_selectors: strToKeyValueObject(formData.defaultRouterSelectors, ''),
            route_wildcard_policy: formData.isDefaultRouterWildcardPolicyAllowed
              ? WildcardPolicy.WILDCARDS_ALLOWED
              : WildcardPolicy.WILDCARDS_DISALLOWED,
            route_namespace_ownership_policy: formData.isDefaultRouterNamespaceOwnershipPolicyStrict
              ? NamespaceOwnershipPolicy.STRICT
              : NamespaceOwnershipPolicy.INTER_NAMESPACE_ALLOWED,
          },
        ],
      };
    }

    // byoc && vpc && configure proxy
    if (isInstallExistingVPC && configureProxySelected) {
      const proxy = {};
      if (formData.http_proxy_url) {
        proxy.http_proxy = formData.http_proxy_url;
      }
      if (formData.https_proxy_url) {
        proxy.https_proxy = formData.https_proxy_url;
      }
      // return no-proxy back to a string
      if (formData.no_proxy_domains) {
        proxy.no_proxy = formData.no_proxy_domains.join(',');
      }
      if (Object.keys(proxy).length !== 0) {
        clusterRequest.proxy = proxy;
      }
      if (formData.additional_trust_bundle) {
        clusterRequest.additional_trust_bundle = formData.additional_trust_bundle;
      }
    }
  } else {
    // Don't pass LB and storage to byoc cluster.
    // default to zero load balancers
    clusterRequest.load_balancer_quota = parseInt(formData.load_balancers, 10);
    // values in the passed are always in bytes.
    // see comment in PersistentStorageDropdown.js#82.
    // Default to 100 GiB in bytes
    clusterRequest.storage_quota = {
      unit: 'B',
      value: parseFloat(formData.persistent_storage),
    };

    if (actualCloudProviderID === 'gcp') {
      clusterRequest.gcp = {
        security: {
          secure_boot: formData.secure_boot,
        },
      };
    }
  }

  if (formData.hypershift) {
    clusterRequest.hypershift = { enabled: isHypershiftSelected };
  }

  if (isHypershiftSelected) {
    clusterRequest.multi_az = true;
  }

  return clusterRequest;
};

export const upgradeScheduleRequest = (formData) =>
  formData.upgrade_policy === 'manual'
    ? null
    : {
        schedule_type: formData.upgrade_policy,
        schedule: formData.automatic_upgrade_schedule,
      };

// Returning a function that takes (formData) is convenient for redux-form `onSubmit` prop.
const submitOSDRequest = (dispatch, params) => (formData) => {
  const { isWizard, cloudProviderID, product } = params;
  const clusterRequest = createClusterRequest({ isWizard, cloudProviderID, product }, formData);
  const upgradeSchedule = upgradeScheduleRequest(formData);
  dispatch(createCluster(clusterRequest, upgradeSchedule));
};

export default submitOSDRequest;
