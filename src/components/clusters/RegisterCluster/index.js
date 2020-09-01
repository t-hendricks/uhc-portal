import { connect } from 'react-redux';
import { reduxForm, reset } from 'redux-form';
import get from 'lodash/get';
import RegisterCluster from './RegisterCluster';
import { openModal, closeModal } from '../../common/Modal/ModalActions';
import shouldShowModal from '../../common/Modal/ModalSelectors';
import { getOrganizationAndQuota } from '../../../redux/actions/userActions';
import { registerDisconnectedCluster, resetCreatedClusterResponse } from '../../../redux/actions/clustersActions';
import hasOrgLevelsubscribeOCPCapability from './RegisterClusterSelectors';
import {
  subscriptionSystemUnits,
} from '../../../common/subscriptionTypes';


const reduxFormConfig = {
  form: 'RegisterCluster',
};

const reduxFormRegisterCluster = reduxForm(reduxFormConfig)(RegisterCluster);

const mapStateToProps = (state) => {
  const canSubscribeOCP = hasOrgLevelsubscribeOCPCapability(state);
  return ({
    canSubscribeOCP,
    registerClusterResponse: state.clusters.createdCluster,
    isOpen: shouldShowModal(state, 'register-cluster-error'),
    quotaRequstFullfilled: get(state, 'userProfile.organization.fulfilled', false),
    initialValues: {
      cluster_id: '',
      display_name: '',
      web_console_url: '',
      support_level: '',
      service_level: '',
      usage: '',
      system_units: canSubscribeOCP ? subscriptionSystemUnits.CORES_VCPU : '',
      cpu_total: '',
      socket_total: '',
    },
  });
};

const mapDispatchToProps = dispatch => ({
  closeModal: (name) => { dispatch(closeModal(name)); },
  openModal: (name) => { dispatch(openModal(name)); },
  onSubmit: (formData) => {
    const clusterRequest = {
      cluster_uuid: formData.cluster_id,
      plan_id: 'OCP',
      status: 'Disconnected',
      display_name: formData.display_name,
      console_url: formData.web_console_url,
    };

    let subscriptionRequest = null;

    if (formData.support_level !== 'Eval' && formData.support_level !== '') {
      subscriptionRequest = {
        support_level: formData.support_level,
        service_level: formData.service_level,
        usage: formData.usage,
        system_units: formData.system_units,
      };

      if (formData.system_units === 'Sockets') {
        subscriptionRequest.socket_total = parseInt(formData.socket_total, 10);
      }

      if (formData.system_units === 'Cores/vCPU') {
        subscriptionRequest.cpu_total = parseInt(formData.cpu_total, 10);
        subscriptionRequest.socket_total = 1;
      }
    }

    dispatch(registerDisconnectedCluster(clusterRequest, subscriptionRequest));
  },
  resetResponse: () => dispatch(resetCreatedClusterResponse()),
  resetForm: () => dispatch(reset('RegisterCluster')),
  getOrganizationAndQuota: () => dispatch(getOrganizationAndQuota()),
});


export default connect(mapStateToProps, mapDispatchToProps)(reduxFormRegisterCluster);
