import { connect } from 'react-redux';
import { isValid } from 'redux-form';

import AssociateAWSAccountModal from './AssociatedAWSAccountModal';
import { closeModal } from '../../../../../common/Modal/ModalActions';
import shouldShowModal from '../../../../../common/Modal/ModalSelectors';

const mapStateToProps = state => ({
  isOpen: shouldShowModal(state, 'associate-aws-modal'),
  isValid: isValid('CreateCluster')(state),
});

const mapDispatchToProps = dispatch => ({
  closeModal: () => dispatch(closeModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AssociateAWSAccountModal);
