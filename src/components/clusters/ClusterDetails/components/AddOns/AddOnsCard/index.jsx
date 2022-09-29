import { connect } from 'react-redux';
import AddOnsCard from './AddOnsCard';
import { addClusterAddOn } from '../AddOnsActions';
import { modalActions } from '../../../../../common/Modal/ModalActions';

const mapStateToProps = (state) => ({
  cluster: state.clusters.details.cluster,
  addClusterAddOnResponse: state.addOns.addClusterAddOnResponse,
});

const mapDispatchToProps = {
  addClusterAddOn,
  openModal: modalActions.openModal,
  closeModal: modalActions.closeModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddOnsCard);
