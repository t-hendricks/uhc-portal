import { connect } from 'react-redux';
import AddGrantModal from './AddGrantModal';
import { addGrant, clearAddGrantResponse } from '../NetworkSelfServiceActions';

import { closeModal } from '../../../../../../common/Modal/ModalActions';
import shouldShowModal from '../../../../../../common/Modal/ModalSelectors';

const mapStateToProps = (state) => ({
  isOpen: shouldShowModal(state, 'grant-modal'),
  addGrantResponse: state.networkSelfService.addGrantResponse,
  roles: state.networkSelfService.roles.data,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  closeModal: () => dispatch(closeModal()),
  clearAddGrantResponse: () => dispatch(clearAddGrantResponse()),
  submit: (role, arn) => {
    dispatch(addGrant(ownProps.clusterID, role, arn));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AddGrantModal);
