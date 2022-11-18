import { connect } from 'react-redux';
import { closeModal } from '../Modal/ModalActions';
import ErrorModal from './ErrorModal';

const mapDispatchToProps = (dispatch) => ({
  closeModal: () => {
    dispatch(closeModal());
  },
});

export default connect(null, mapDispatchToProps)(ErrorModal);
