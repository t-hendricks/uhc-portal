import { connect } from 'react-redux';
import { reduxForm, reset } from 'redux-form';
import { createCluster, resetCreatedClusterResponse } from '../../../redux/actions/clustersActions';
import { getMachineTypes } from '../../../redux/actions/machineTypesActions';
import { getOrganizationAndQuota } from '../../../redux/actions/userActions';
import { getCloudProviders } from '../../../redux/actions/cloudProviderActions';
import getLoadBalancerValues from '../../../redux/actions/loadBalancerActions';
import getPersistentStorageValues from '../../../redux/actions/persistentStorageActions';
import CreateOSDCluster from './CreateOSDCluster';
import shouldShowModal from '../../common/Modal/ModalSelectors';
import { openModal } from '../../common/Modal/ModalActions';

const reduxFormConfig = {
  form: 'CreateCluster',
};
const reduxFormCreateCluster = reduxForm(reduxFormConfig)(CreateOSDCluster);

const mapStateToProps = state => ({
  createClusterResponse: state.clusters.createdCluster,
  machineTypes: state.machineTypes,
  organization: state.userProfile.organization,
  cloudProviders: state.cloudProviders.cloudProviders,
  loadBalancerValues: state.loadBalancerValues.loadBalancerValues,
  persistentStorageValues: state.persistentStorageValues.persistentStorageValues,
  isOpen: shouldShowModal(state, 'osd-create-error'),
  initialValues: {
    name: '',
    nodes_compute: '4',
    dns_base_domain: '',
    aws_access_key_id: '',
    aws_secret_access_key: '',
    region: 'us-east-1',
    multi_az: false,
    persistent_storage: '107374182400', // The default storage to 100 GiB (in bytes).
    load_balancers: '0',
  },
});

const mapDispatchToProps = dispatch => ({
  onSubmit: (formData) => {
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
      multi_az: formData.multi_az === 'true',
      network: {
        machine_cidr: formData.network_machine_cidr,
        service_cidr: formData.network_service_cidr,
        pod_cidr: formData.network_pod_cidr,
      },
      managed: true,
      // default to zero load balancers
      load_balancer_quota: parseInt(formData.load_balancers, 10),
      // values in the passed are always in bytes.
      // see comment in PersistentStorageComboBox.js#82.
      // Default to 100 GiB in bytes
      storage_quota: {
        unit: 'B',
        value: parseFloat(formData.persistent_storage),
      },
    };

    dispatch(createCluster(clusterRequest));
  },
  resetResponse: () => dispatch(resetCreatedClusterResponse()),
  resetForm: () => dispatch(reset('CreateCluster')),
  openModal: () => { dispatch(openModal('osd-create-error')); },
  getOrganizationAndQuota,
  getMachineTypes,
  getCloudProviders,
  getPersistentStorage: getPersistentStorageValues,
  getLoadBalancers: getLoadBalancerValues,
});

export default connect(mapStateToProps, mapDispatchToProps)(reduxFormCreateCluster);
