import { connect } from 'react-redux';
import { reduxForm, reset, formValueSelector } from 'redux-form';
import pick from 'lodash/pick';
import isEmpty from 'lodash/isEmpty';

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

import { normalizedProducts } from '../../../common/subscriptionTypes';
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
  const { product, cloudProviderID } = ownProps;
  const isAwsForm = cloudProviderID === 'aws';
  const defaultRegion = isAwsForm ? AWS_DEFAULT_REGION : GCP_DEFAULT_REGION;

  let privateClusterSelected = false;
  const valueSelector = formValueSelector('CreateCluster');
  privateClusterSelected = valueSelector(state, 'cluster_privacy') === 'internal';

  return ({
    createClusterResponse: state.clusters.createdCluster,
    machineTypes: state.machineTypes,
    organization,

    selectedRegion: valueSelector(state, 'region'),
    installToVPCSelected: valueSelector(state, 'install_to_vpc'),
    isErrorModalOpen: shouldShowModal(state, 'osd-create-error'),
    isBYOCModalOpen: shouldShowModal(state, 'customer-cloud-subscription'),
    isAutomaticUpgrade: valueSelector(state, 'upgrade_policy') === 'automatic',

    cloudProviders: state.cloudProviders,
    persistentStorageValues: state.persistentStorageValues,
    loadBalancerValues: state.loadBalancerValues,

    clustersQuota: {
      hasOsdQuota: hasManagedQuotaSelector(state, normalizedProducts.OSD),
      hasAwsQuota: hasAwsQuotaSelector(state, normalizedProducts.OSD),
      hasGcpQuota: hasGcpQuotaSelector(state, normalizedProducts.OSD),
      aws: awsQuotaSelector(state),
      gcp: gcpQuotaSelector(state),
    },

    canEnableEtcdEncryption: canEnableEtcdSelector(state),

    privateClusterSelected,
    product,

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
    },
  });
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSubmit: async (formData) => {
    const clusterRequest = {
      name: formData.name,
      region: {
        id: formData.region,
      },
      nodes: {
        compute: parseInt(formData.nodes_compute, 10),
        compute_machine_type: {
          id: formData.machine_type,
        },
      },
      managed: true,
      cloud_provider: {
        id: ownProps.cloudProviderID,
      },
      multi_az: formData.multi_az === 'true',
      node_drain_grace_period: {
        value: formData.node_drain_grace_period,
        unit: 'minutes',
      },
      etcd_encryption: formData.etcd_encryption,
    };

    const parsedLabels = parseReduxFormKeyValueList(formData.node_labels);

    if (!isEmpty(parsedLabels)) {
      clusterRequest.nodes.compute_labels = parseReduxFormKeyValueList(formData.node_labels);
    }
    if (ownProps.product) {
      clusterRequest.product = {
        id: ownProps.product,
      };
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
        if (formData.network_configuration_toggle === 'advanced' && formData.install_to_vpc) {
          let subnetIds = [
            formData.private_subnet_id_0, formData.public_subnet_id_0,
          ];

          if (formData.multi_az === 'true') {
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

          if (formData.multi_az === 'true') {
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
