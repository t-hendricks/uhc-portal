import { connect } from 'react-redux';
import { reduxForm, reset } from 'redux-form';
import get from 'lodash/get';

import { createCluster, resetCreatedClusterResponse } from '../../../redux/actions/clustersActions';
import { getMachineTypes } from '../../../redux/actions/machineTypesActions';
import { getOrganizationAndQuota } from '../../../redux/actions/userActions';
import { getCloudProviders } from '../../../redux/actions/cloudProviderActions';
import getLoadBalancerValues from '../../../redux/actions/loadBalancerActions';
import getPersistentStorageValues from '../../../redux/actions/persistentStorageActions';
import CreateOSDCluster from './CreateOSDCluster';
import shouldShowModal from '../../common/Modal/ModalSelectors';
import { openModal, closeModal } from '../../common/Modal/ModalActions';

const reduxFormConfig = {
  form: 'CreateCluster',
};
const reduxFormCreateCluster = reduxForm(reduxFormConfig)(CreateOSDCluster);

const mapStateToProps = (state) => {
  const { organization } = state.userProfile;
  const byocQuota = get(organization, 'quotaList.clusterQuota.byoc', {});
  const rhInfraQuota = get(organization, 'quotaList.clusterQuota.rhInfra', {});

  return ({
    createClusterResponse: state.clusters.createdCluster,
    machineTypes: state.machineTypes,
    organization,
    cloudProviders: state.cloudProviders.cloudProviders,
    loadBalancerValues: state.loadBalancerValues.loadBalancerValues,
    persistentStorageValues: state.persistentStorageValues.persistentStorageValues,
    isErrorModalOpen: shouldShowModal(state, 'osd-create-error'),
    isBYOCModalOpen: shouldShowModal(state, 'customer-cloud-subscription'),
    quota: {
      byoc: {
        hasQuota: get(byocQuota, 'available', 0) > 0,
        multiAz: get(byocQuota, 'multiAz.available', 0),
        singleAz: get(byocQuota, 'singleAz.available', 0),
      },
      rhInfra: {
        hasQuota: get(rhInfraQuota, 'available', 0) > 0,
        multiAz: get(rhInfraQuota, 'multiAz.available', 0),
        singleAz: get(rhInfraQuota, 'singleAz.available', 0),
      },
    },
    initialValues: {
      byoc: 'false',
      name: '',
      nodes_compute: '4',
      dns_base_domain: '',
      aws_access_key_id: '',
      aws_secret_access_key: '',
      region: 'us-east-1',
      multi_az: false,
      persistent_storage: '107374182400',
      load_balancers: '0',
    },
  });
};

const mapDispatchToProps = dispatch => ({
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
      multi_az: formData.multi_az === 'true',
      network: {
        machine_cidr: formData.network_machine_cidr,
        service_cidr: formData.network_service_cidr,
        pod_cidr: formData.network_pod_cidr,
      },
      managed: true,
    };

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
      // see comment in PersistentStorageComboBox.js#82.
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

export default connect(mapStateToProps, mapDispatchToProps)(reduxFormCreateCluster);
