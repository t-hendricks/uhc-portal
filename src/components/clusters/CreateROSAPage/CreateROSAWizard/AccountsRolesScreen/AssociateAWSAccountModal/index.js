import { connect } from 'react-redux';
import { isValid } from 'redux-form';

import AssociateAWSAccountModal from './AssociatedAWSAccountModal';
import { closeModal } from '../../../../../common/Modal/ModalActions';
import shouldShowModal from '../../../../../common/Modal/ModalSelectors';

const mapStateToProps = state => ({
  isOpen: shouldShowModal(state, 'associate-aws-modal'),
  isValid: isValid('CreateCluster')(state),
  token: state.modal.data,
});

const mapDispatchToProps = dispatch => ({
  closeModal: () => dispatch(closeModal()),
  submit: () => {
    // dispatch(addGrant(ownProps.clusterID, role, arn));
    // eslint-disable-next-line no-console
    console.log('submitted new associated aws account');
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AssociateAWSAccountModal);
