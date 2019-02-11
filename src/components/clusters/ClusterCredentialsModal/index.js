
import { connect } from 'react-redux';
import { closeModal } from '../../common/Modal/ModalActions';
import shouldShowModal from '../../common/Modal/ModalSelectors';
import ClusterCredentialsModal from './ClusterCredentialsModal';

const mapStateToProps = state => ({
  isOpen: shouldShowModal(state, 'cluster-credentials'),
});

const mapDispatchToProps = {
  close: () => closeModal('cluster-credentials'),
};

export default connect(mapStateToProps, mapDispatchToProps)(ClusterCredentialsModal);
