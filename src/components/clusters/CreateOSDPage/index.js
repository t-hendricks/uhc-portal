import { connect } from 'react-redux';
import { reduxForm, reset } from 'redux-form';

import { createCluster, resetCreatedClusterResponse } from '../../../redux/actions/clustersActions';
import { getMachineTypes } from '../../../redux/actions/machineTypesActions';
import { getOrganizationAndQuota } from '../../../redux/actions/userActions';
import { getCloudProviders } from '../../../redux/actions/cloudProviderActions';
import getLoadBalancerValues from '../../../redux/actions/loadBalancerActions';
import getPersistentStorageValues from '../../../redux/actions/persistentStorageActions';
import CreateOSDPage from './CreateOSDPage';
import shouldShowModal from '../../common/Modal/ModalSelectors';
import { openModal, closeModal } from '../../common/Modal/ModalActions';
import {
  hasOSDQuotaSelector,
  hasAwsQuotaSelector,
  hasGcpQuotaSelector,
  awsQuotaSelector,
  gcpQuotaSelector,
} from '../CreateClusterPage/quotaSelector';

const reduxFormConfig = {
  form: 'CreateCluster',
};
const reduxFormCreateOSDPage = reduxForm(reduxFormConfig)(CreateOSDPage);

const mapStateToProps = (state, ownProps) => {
  const { organization } = state.userProfile;

  return ({
    createClusterResponse: state.clusters.createdCluster,
    machineTypes: state.machineTypes,
    organization,

    isErrorModalOpen: shouldShowModal(state, 'osd-create-error'),
    isBYOCModalOpen: shouldShowModal(state, 'customer-cloud-subscription'),

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

    initialValues: {
      byoc: 'false',
      name: '',
      nodes_compute: '4',
      dns_base_domain: '',
      aws_access_key_id: '',
      aws_secret_access_key: '',
      region: ownProps.cloudProviderID === 'aws' ? 'us-east-1' : 'asia-east1',
      multi_az: false,
      persistent_storage: '107374182400',
      load_balancers: '0',
    },
  });
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSubmit: (formData) => {
    const clusterRequest = {
      byoc: formData.byoc === 'true',
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
    };
    if (formData.network_configuration_toggle === 'advanced') {
      clusterRequest.network = {
        machine_cidr: formData.network_machine_cidr,
        service_cidr: formData.network_service_cidr,
        pod_cidr: formData.network_pod_cidr,
        host_prefix: parseInt(formData.network_host_prefix, 10),
      };
    }

    if (formData.byoc === 'true') {
      clusterRequest.aws = {
        access_key_id: formData.access_key_id,
        account_id: formData.account_id,
        secret_access_key: formData.secret_access_key,
      };
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
  getMachineTypes,
  getCloudProviders,
  getPersistentStorage: getPersistentStorageValues,
  getLoadBalancers: getLoadBalancerValues,
});

export default connect(mapStateToProps, mapDispatchToProps)(reduxFormCreateOSDPage);
