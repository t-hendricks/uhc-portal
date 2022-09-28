import { connect } from 'react-redux';
import { reduxForm, reset } from 'redux-form';
import get from 'lodash/get';
import RegisterCluster from './RegisterCluster';
import { openModal, closeModal } from '../../common/Modal/ModalActions';
import shouldShowModal from '../../common/Modal/ModalSelectors';
import { getOrganizationAndQuota } from '../../../redux/actions/userActions';
import {
  registerDisconnectedCluster,
  resetCreatedClusterResponse,
} from '../../../redux/actions/clustersActions';
import hasOrgLevelsubscribeOCPCapability from './RegisterClusterSelectors';
import { subscriptionSystemUnits } from '../../../common/subscriptionTypes';

const reduxFormConfig = {
  form: 'RegisterCluster',
};

const reduxFormRegisterCluster = reduxForm(reduxFormConfig)(RegisterCluster);

const mapStateToProps = (state) => {
  const canSubscribeOCP = hasOrgLevelsubscribeOCPCapability(state);
  return {
    canSubscribeOCP,
    registerClusterResponse: state.clusters.createdCluster,
    isOpen: shouldShowModal(state, 'register-cluster-error'),
    quotaResponse: get(state, 'userProfile.organization', null),
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
  };
};

const mapDispatchToProps = (dispatch) => ({
  closeModal: (name) => {
    dispatch(closeModal(name));
  },
  openModal: (name) => {
    dispatch(openModal(name));
  },
  onSubmit: (registrationRequest, subscriptionRequest) => {
    // This request goes to account-manager,
    dispatch(registerDisconnectedCluster(registrationRequest, subscriptionRequest));
  },
  resetResponse: () => dispatch(resetCreatedClusterResponse()),
  resetForm: () => dispatch(reset('RegisterCluster')),
  getOrganizationAndQuota: () => dispatch(getOrganizationAndQuota()),
});

export default connect(mapStateToProps, mapDispatchToProps)(reduxFormRegisterCluster);
