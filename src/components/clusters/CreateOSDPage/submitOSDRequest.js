import pick from 'lodash/pick';
import isEmpty from 'lodash/isEmpty';

import config from '../../../config';

import { createCluster } from '../../../redux/actions/clustersActions';
import { parseReduxFormKeyValueList } from '../../../common/helpers';

export const createClusterRequest = ({ cloudProviderID, product }, formData) => {
  const isMultiAz = formData.multi_az === 'true';
  // in non-wizard, cloudProviderID is supplied as a parameter. in the wizard, it's in the form.
  const actualCloudProviderID = cloudProviderID || formData.cloud_provider;
  const actualProduct = product || formData.product;

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
    disable_user_workload_monitoring: !formData.enable_user_workload_monitoring,
  };

  if (formData.billing_model) {
    const [billing] = formData.billing_model.split('-');
    clusterRequest.billing_model = billing;
  } else {
    clusterRequest.billing_model = 'standard';
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

  const parsedLabels = parseReduxFormKeyValueList(formData.node_labels || [{}]);

  if (!isEmpty(parsedLabels)) {
    clusterRequest.nodes.compute_labels = parseReduxFormKeyValueList(formData.node_labels);
  }
  if (config.fakeOSD) {
    clusterRequest.properties = { fake_cluster: 'true' };
  }

  if (formData.network_configuration_toggle === 'advanced') {
    clusterRequest.network = {
      machine_cidr: formData.network_machine_cidr,
      service_cidr: formData.network_service_cidr,
      pod_cidr: formData.network_pod_cidr,
      host_prefix: parseInt(formData.network_host_prefix, 10),
    };
    clusterRequest.api = {
      listening: formData.cluster_privacy,
    };
  }
  const isInstallExistingVPC = formData.network_configuration_toggle === 'advanced' && formData.install_to_vpc;
  if (formData.byoc === 'true') {
    clusterRequest.ccs = {
      enabled: true,
    };
    if (actualCloudProviderID === 'aws') {
      clusterRequest.aws = {
        access_key_id: formData.access_key_id,
        account_id: formData.account_id,
        secret_access_key: formData.secret_access_key,
      };
      if (formData.customer_managed_key) {
        clusterRequest.aws.kms_key_arn = formData.kms_key_arn;
      }
      clusterRequest.ccs.disable_scp_checks = formData.disable_scp_checks;
      if (isInstallExistingVPC) {
        let subnetIds = [
          formData.private_subnet_id_0, formData.public_subnet_id_0,
        ];

        if (isMultiAz) {
          subnetIds = [
            ...subnetIds,
            formData.private_subnet_id_1, formData.public_subnet_id_1,
            formData.private_subnet_id_2, formData.public_subnet_id_2,
          ];
        }
        clusterRequest.aws.subnet_ids = subnetIds;

        let AZs = [
          formData.az_0,
        ];

        if (isMultiAz) {
          AZs = [
            ...AZs,
            formData.az_1,
            formData.az_2,
          ];
        }
        clusterRequest.nodes.availability_zones = AZs;
      }
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
        id: 'osd-4',
      };
      if (isInstallExistingVPC) {
        clusterRequest.gcp_network = {
          vpc_name: formData.vpc_name,
          control_plane_subnet: formData.control_plane_subnet,
          compute_subnet: formData.compute_subnet,
        };
      }
      if (formData.customer_managed_key) {
        clusterRequest.gcp_encryption_key = {
          key_name: formData.key_name,
          key_ring: formData.key_ring,
          key_location: formData.key_location,
          kms_key_service_account: formData.kms_service_account,
        };
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
  return clusterRequest;
};

export const upgradeScheduleRequest = formData => (
  formData.upgrade_policy === 'manual' ? null : {
    schedule_type: formData.upgrade_policy,
    schedule: formData.automatic_upgrade_schedule,
  }
);

// Returning a function that takes (formData) is convenient for redux-form `onSubmit` prop.
const submitOSDRequest = (dispatch, { cloudProviderID, product }) => (formData) => {
  const clusterRequest = createClusterRequest({ cloudProviderID, product }, formData);
  const upgradeSchedule = upgradeScheduleRequest(formData);
  dispatch(createCluster(clusterRequest, upgradeSchedule));
};

export default submitOSDRequest;
