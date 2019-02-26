
import { connect } from 'react-redux';
import { openModal } from '../Modal/ModalActions';
import ClusterActionsDropdown from './ClusterActionsDropdown';

const mapDispatchToProps = {
  openModal,
};

export default connect(null, mapDispatchToProps)(ClusterActionsDropdown);
