
import { connect } from 'react-redux';
import { closeModal } from '../../Modal/ModalActions';
import shouldShowModal from '../../Modal/ModalSelectors';
import ClusterCredentialsModal from './ClusterCredentialsModal';

const mapStateToProps = state => ({
  isOpen: shouldShowModal(state, 'cluster-credentials'),
});

const mapDispatchToProps = {
  close: () => closeModal('cluster-credentials'),
};

export default connect(mapStateToProps, mapDispatchToProps)(ClusterCredentialsModal);
