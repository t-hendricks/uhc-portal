import { connect } from 'react-redux';

import shouldShowModal from '../ModalSelectors';
import ConnectedModal from './ConnectedModal';

const mapStateToProps = (state, ownProps) => ({
  isOpen: shouldShowModal(state, ownProps.ModalComponent.modalName),
});

export default connect(mapStateToProps)(ConnectedModal);
