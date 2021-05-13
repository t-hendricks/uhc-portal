import { connect } from 'react-redux';
import { reduxForm, reset, formValueSelector } from 'redux-form';
import pick from 'lodash/pick';
import isEmpty from 'lodash/isEmpty';

import config from '../../../config';
import { createCluster, resetCreatedClusterResponse } from '../../../redux/actions/clustersActions';
import { getMachineTypes } from '../../../redux/actions/machineTypesActions';
import { getOrganizationAndQuota } from '../../../redux/actions/userActions';
import { getCloudProviders } from '../../../redux/actions/cloudProviderActions';
import getLoadBalancerValues from '../../../redux/actions/loadBalancerActions';
import getPersistentStorageValues from '../../../redux/actions/persistentStorageActions';
import CreateOSDPage from './CreateOSDPage';
import shouldShowModal from '../../common/Modal/ModalSelectors';
import { openModal, closeModal } from '../../common/Modal/ModalActions';
import { scrollToFirstError, parseReduxFormKeyValueList } from '../../../common/helpers';
import { billingModels, normalizedProducts } from '../../../common/subscriptionTypes';

import { canAutoScaleSelector } from '../ClusterDetails/components/MachinePools/MachinePoolsSelectors';
import { OSD_TRIAL_FEATURE } from '../../../redux/constants/featureConstants';

import {
  hasManagedQuotaSelector,
  hasAwsQuotaSelector,
  hasGcpQuotaSelector,
  awsQuotaSelector,
  gcpQuotaSelector,
} from '../common/quotaSelectors';
import canEnableEtcdSelector from './CreateOsdPageSelectors';

const AWS_DEFAULT_REGION = 'us-east-1';
const GCP_DEFAULT_REGION = 'us-east1';

const reduxFormConfig = {
  form: 'CreateCluster',
  onSubmitFail: scrollToFirstError,
};

const reduxFormCreateOSDPage = reduxForm(reduxFormConfig)(CreateOSDPage);

const mapStateToProps = (state, ownProps) => {
  const { organization } = state.userProfile;
  const { cloudProviderID } = ownProps;
  const isAwsForm = cloudProviderID === 'aws';
  const defaultRegion = isAwsForm ? AWS_DEFAULT_REGION : GCP_DEFAULT_REGION;
  const { STANDARD, MARKETPLACE } = billingModels;
  const { OSD, OSDTrial } = normalizedProducts;

  const valueSelector = formValueSelector('CreateCluster');
  const privateClusterSelected = valueSelector(state, 'cluster_privacy') === 'internal';
  const customerManagedEncryptionSelected = valueSelector(state, 'customer_managed_key');

  // The user may select a different product after entering the creation page
  // thus it could differ from the product in the URL
  const selectedProduct = valueSelector(state, 'product');
  const product = selectedProduct || ownProps.product;

  const hasAwsQuota = hasAwsQuotaSelector(state, product, STANDARD)
                   || hasAwsQuotaSelector(state, product, MARKETPLACE);
  const hasGcpQuota = hasGcpQuotaSelector(state, product, STANDARD)
                   || hasGcpQuotaSelector(state, product, MARKETPLACE);

  const hasStandardOSDQuota = hasAwsQuotaSelector(state, OSD, STANDARD)
                           || hasGcpQuotaSelector(state, OSD, STANDARD);

  return ({
    createClusterResponse: state.clusters.createdCluster,
    machineTypes: state.machineTypes,
    organization,
    customerManagedEncryptionSelected,
    selectedRegion: valueSelector(state, 'region'),
    installToVPCSelected: valueSelector(state, 'install_to_vpc'),
    isErrorModalOpen: shouldShowModal(state, 'osd-create-error'),
    isBYOCModalOpen: shouldShowModal(state, 'customer-cloud-subscription'),
    isAutomaticUpgrade: valueSelector(state, 'upgrade_policy') === 'automatic',

    cloudProviders: state.cloudProviders,
    persistentStorageValues: state.persistentStorageValues,
    loadBalancerValues: state.loadBalancerValues,

    clustersQuota: {
      hasStandardOSDQuota,
      hasProductQuota: hasManagedQuotaSelector(state, product),
      hasOSDTrialQuota: hasManagedQuotaSelector(state, OSDTrial),
      hasMarketplaceProductQuota: hasAwsQuotaSelector(state, product, MARKETPLACE)
                               || hasGcpQuotaSelector(state, product, MARKETPLACE),
      hasAwsQuota,
      hasGcpQuota,
      aws: awsQuotaSelector(state, product, STANDARD),
      gcp: gcpQuotaSelector(state, product, STANDARD),
      marketplace: {
        // RHM does not sell OSD Trial access
        aws: awsQuotaSelector(state, OSD, MARKETPLACE),
        gcp: gcpQuotaSelector(state, OSD, MARKETPLACE),
      },
    },

    canEnableEtcdEncryption: canEnableEtcdSelector(state),

    privateClusterSelected,
    product,

    canAutoScale: canAutoScaleSelector(state, product),
    autoscalingEnabled: !!valueSelector(state, 'autoscalingEnabled'),
    autoScaleMinNodesValue: valueSelector(state, 'min_replicas'),
    autoScaleMaxNodesValue: valueSelector(state, 'max_replicas'),
    osdTrialFeature: state.features[OSD_TRIAL_FEATURE],
    billingModel: valueSelector(state, 'billing_model'),

    initialValues: {
      byoc: 'false',
      name: '',
      nodes_compute: '4',
      dns_base_domain: '',
      aws_access_key_id: '',
      aws_secret_access_key: '',
      region: defaultRegion,
      multi_az: 'false',
      persistent_storage: '107374182400',
      load_balancers: '0',
      network_configuration_toggle: 'basic',
      disable_scp_checks: false,
      node_drain_grace_period: 60,
      upgrade_policy: 'manual',
      automatic_upgrade_schedule: '0 0 * * 0',
      node_labels: [{}],
      billing_model: 'standard',
      product: ownProps.product,
      enable_user_workload_monitoring: true,
    },
  });
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSubmit: async (formData) => {
    const isMultiAz = formData.multi_az === 'true';
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
      cloud_provider: {
        id: ownProps.cloudProviderID,
      },
      multi_az: isMultiAz,
      node_drain_grace_period: {
        value: formData.node_drain_grace_period,
        unit: 'minutes',
      },
      etcd_encryption: formData.etcd_encryption,
      billing_model: 'standard',
      disable_users_workload_monitoring: !formData.enable_user_workload_monitoring,
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

    const parsedLabels = parseReduxFormKeyValueList(formData.node_labels);

    if (!isEmpty(parsedLabels)) {
      clusterRequest.nodes.compute_labels = parseReduxFormKeyValueList(formData.node_labels);
    }
    if (formData.product) {
      clusterRequest.product = {
        id: formData.product.toLowerCase(),
      };
    } else if (ownProps.product) {
      clusterRequest.product = {
        id: ownProps.product.toLowerCase(),
      };
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
      if (ownProps.cloudProviderID === 'aws') {
        clusterRequest.aws = {
          access_key_id: formData.access_key_id,
          account_id: formData.account_id,
          secret_access_key: formData.secret_access_key,
        };
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
      } else if (ownProps.cloudProviderID === 'gcp') {
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
    dispatch(createCluster(clusterRequest,
      {
        upgrade_policy: formData.upgrade_policy,
        automatic_upgrade_schedule: formData.automatic_upgrade_schedule,
      }));
  },
  resetResponse: () => dispatch(resetCreatedClusterResponse()),
  resetForm: () => dispatch(reset('CreateCluster')),
  openModal: (modalName) => { dispatch(openModal(modalName)); },
  closeModal: () => { dispatch(closeModal()); },
  getOrganizationAndQuota: () => dispatch(getOrganizationAndQuota()),
  getMachineTypes: () => dispatch(getMachineTypes()),
  getCloudProviders: () => dispatch(getCloudProviders()),
  getPersistentStorage: () => dispatch(getPersistentStorageValues()),
  getLoadBalancers: () => dispatch(getLoadBalancerValues()),
});

export default connect(mapStateToProps, mapDispatchToProps)(reduxFormCreateOSDPage);
