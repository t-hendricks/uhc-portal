import { connect } from 'react-redux';

// import usersActions from './UsersActions';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux/actions/notifications';
import NetworkSelfServiceSection from './NetworkSelfServiceSection';
import {
  getRoles,
  getGrants,
  addGrant,
  clearAddGrantResponse,
  deleteGrant,
} from './NetworkSelfServiceActions';
import grantsSelector from './NetworkSelfServiceSelector';

import { openModal, closeModal } from '../../../../../common/Modal/ModalActions';
import shouldShowModal from '../../../../../common/Modal/ModalSelectors';

const mapStateToProps = (state) => ({
  isModalOpen: shouldShowModal(state, 'grant-modal'),
  grants: { ...state.networkSelfService.grants, data: grantsSelector(state) },
  addGrantResponse: state.networkSelfService.addGrantResponse,
  deleteGrantResponse: state.networkSelfService.deleteGrantResponse,
  roles: state.networkSelfService.roles,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  openAddGrantModal: () => dispatch(openModal('grant-modal')),
  closeModal: () => dispatch(closeModal()),
  getRoles: () => dispatch(getRoles()),
  getGrants: () => dispatch(getGrants(ownProps.clusterID)),
  clearAddGrantResponse: () => dispatch(clearAddGrantResponse()),
  submit: (role, arn) => {
    dispatch(addGrant(ownProps.clusterID, role, arn));
  },
  deleteGrant: (grantId) => dispatch(deleteGrant(ownProps.clusterID, grantId)),
  addNotification: (data) => dispatch(addNotification(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NetworkSelfServiceSection);
