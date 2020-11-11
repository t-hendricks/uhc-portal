import { connect } from 'react-redux';
import { reduxForm, reset, formValueSelector } from 'redux-form';
import pick from 'lodash/pick';

import { createCluster, resetCreatedClusterResponse } from '../../../redux/actions/clustersActions';
import { getMachineTypes } from '../../../redux/actions/machineTypesActions';
import { getOrganizationAndQuota } from '../../../redux/actions/userActions';
import { getCloudProviders } from '../../../redux/actions/cloudProviderActions';
import getLoadBalancerValues from '../../../redux/actions/loadBalancerActions';
import getPersistentStorageValues from '../../../redux/actions/persistentStorageActions';
import CreateOSDPage from './CreateOSDPage';
import shouldShowModal from '../../common/Modal/ModalSelectors';
import { openModal, closeModal } from '../../common/Modal/ModalActions';
import { scrollToFirstError, readFile, strToCleanObject } from '../../../common/helpers';

import {
  hasOSDQuotaSelector,
  hasAwsQuotaSelector,
  hasGcpQuotaSelector,
  awsQuotaSelector,
  gcpQuotaSelector,
} from '../common/quotaSelectors';
import { validateGCPServiceAccount } from '../../../common/validators';
import { GCP_CCS_FEATURE } from '../../../redux/constants/featureConstants';

const AWS_DEFAULT_REGION = 'us-east-1';
const GCP_DEFAULT_REGION = 'us-east1';

const reduxFormConfig = {
  form: 'CreateCluster',
  onSubmitFail: scrollToFirstError,
  asyncValidate: (values) => {
    if (values.gcp_service_account) {
      return validateGCPServiceAccount(values.gcp_service_account);
    }
    return Promise.resolve(); // RF API requires to return a promise
  },
  asyncChangeFields: ['gcp_service_account'],
};

const reduxFormCreateOSDPage = reduxForm(reduxFormConfig)(CreateOSDPage);

const mapStateToProps = (state, ownProps) => {
  const { organization } = state.userProfile;
  const { product, cloudProviderID } = ownProps;
  const isAwsForm = cloudProviderID === 'aws';
  const defaultRegion = isAwsForm ? AWS_DEFAULT_REGION : GCP_DEFAULT_REGION;

  let privateClusterSelected = false;

  if (isAwsForm) {
    const valueSelector = formValueSelector('CreateCluster');
    privateClusterSelected = valueSelector(state, 'cluster_privacy') === 'internal';
  }

  return ({
    createClusterResponse: state.clusters.createdCluster,
    machineTypes: state.machineTypes,
    organization,

    isErrorModalOpen: shouldShowModal(state, 'osd-create-error'),
    isBYOCModalOpen: shouldShowModal(state, 'customer-cloud-subscription'),
    gcpCCSEnabled: state.features[GCP_CCS_FEATURE],

    cloudProviders: state.cloudProviders,
    persistentStorageValues: state.persistentStorageValues,
    loadBalancerValues: state.loadBalancerValues,

    clustersQuota: {
      hasOsdQuota: hasOSDQuotaSelector(state),
      hasAwsQuota: hasAwsQuotaSelector(state),
      hasGcpQuota: hasGcpQuotaSelector(state),
      aws: awsQuotaSelector(state),
      gcp: gcpQuotaSelector(state),
    },

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
        compute_labels: strToCleanObject(formData.node_labels, '='),
      },
      managed: true,
      cloud_provider: {
        id: ownProps.cloudProviderID,
      },
      multi_az: formData.multi_az === 'true',
    };
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
        clusterRequest.ccs.disable_scp_check = formData.disable_scp_checks;
      } else if (ownProps.cloudProviderID === 'gcp') {
        const text = await readFile(formData.gcp_service_account[0]);
        const parsed = JSON.parse(text);
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
    dispatch(createCluster(clusterRequest));
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
