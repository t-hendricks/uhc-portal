import pick from 'lodash/pick';
import isEmpty from 'lodash/isEmpty';
import uniq from 'lodash/uniq';

import config from '~/config';

import { DEFAULT_FLAVOUR_ID } from '~/redux/actions/flavourActions';
import { createCluster } from '~/redux/actions/clustersActions';
import { parseReduxFormKeyValueList } from '~/common/helpers';

const createClusterAzs = ({ formData, isInstallExistingVPC }) => {
  let AZs = [];
  if (formData.hypershift === 'true') {
    AZs = uniq(formData.machine_pools_subnets.map((subnet) => subnet.availability_zone));
  } else if (isInstallExistingVPC) {
    AZs.push(formData.az_0);
    if (formData.multi_az === 'true') {
      AZs.push(formData.az_1, formData.az_2);
    }
  } else {
    // The backend does not admit an empty list of availability_zones
    return undefined;
  }
  return AZs;
};

const createClusterAwsSubnetIds = ({ formData, isInstallExistingVPC }) => {
  const subnetIds = [];

  if (formData.cluster_privacy_public_subnet?.subnet_id) {
    subnetIds.push(formData.cluster_privacy_public_subnet.subnet_id);
  }

  const isHypershiftSelected = formData.hypershift === 'true';
  if (isHypershiftSelected) {
    const privateSubnetIds = formData.machine_pools_subnets.map((subnet) => subnet.subnet_id);
    subnetIds.push(...privateSubnetIds);
  } else if (isInstallExistingVPC) {
    const showPublicFields = !formData.use_privatelink;

    subnetIds.push(formData.private_subnet_id_0);
    if (showPublicFields) {
      subnetIds.push(formData.public_subnet_id_0);
    }

    const isMultiAz = formData.multi_az === 'true';
    if (isMultiAz) {
      subnetIds.push(formData.private_subnet_id_1, formData.private_subnet_id_2);
      if (showPublicFields) {
        subnetIds.push(formData.public_subnet_id_1, formData.public_subnet_id_2);
      }
    }
  }
  return subnetIds.filter((sn) => !!sn);
};

export const createClusterRequest = ({ isWizard = true, cloudProviderID, product }, formData) => {
  const isMultiAz = formData.multi_az === 'true';
  // See submitOSDRequest.test.js for when we get fields vs side params.
  // But to avoid bugs where we ignore user's choices, when both are present, the field should win.
  const actualCloudProviderID = formData.cloud_provider || cloudProviderID;
  const actualProduct = formData.product || product;
  const isHypershiftSelected = formData.hypershift === 'true';

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
    node_drain_grace_period: {
      value: formData.node_drain_grace_period,
      unit: 'minutes',
    },
    etcd_encryption: formData.etcd_encryption,
    billing_model: 'standard',
    disable_user_workload_monitoring:
      isHypershiftSelected || !formData.enable_user_workload_monitoring,
    ...(!isHypershiftSelected && { fips: !!formData.fips }),
  };

  if (formData.billing_model) {
    const [billing] = formData.billing_model.split('-');
    clusterRequest.billing_model = billing;
  } else {
    clusterRequest.billing_model = 'standard';
  }

  if (formData.cluster_version) {
    clusterRequest.version = formData.cluster_version;
  }

  if (formData.autoscalingEnabled) {
    const minNodes = parseInt(formData.min_replicas, 10);
    const maxNodes = parseInt(formData.max_replicas, 10);

    clusterRequest.nodes.autoscale_compute = {
      min_replicas: isMultiAz ? minNodes * 3 : minNodes,
      max_replicas: isMultiAz ? maxNodes * 3 : maxNodes,
    };
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
              ...(formData.hypershift !== 'true'
                ? { master_role_arn: formData.control_plane_role_arn }
                : {}),
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
      } else {
        // AWS CCS credentials
        clusterRequest.aws = {
          access_key_id: formData.access_key_id,
          account_id: formData.account_id,
          secret_access_key: formData.secret_access_key,
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
        clusterRequest.aws.billing_account_id = formData.billing_account_id;
      }
      clusterRequest.ccs.disable_scp_checks = formData.disable_scp_checks;
      clusterRequest.aws.subnet_ids = createClusterAwsSubnetIds({ formData, isInstallExistingVPC });
      clusterRequest.nodes.availability_zones = createClusterAzs({
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
  }

  if (formData.hypershift) {
    clusterRequest.hypershift = { enabled: isHypershiftSelected };
  }

  if (formData.hypershift === 'true') {
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
