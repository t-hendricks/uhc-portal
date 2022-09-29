import { connect } from 'react-redux';
import AddOnsDrawer from './AddOnsDrawer';
import { addClusterAddOn } from '../AddOnsActions';
import { modalActions } from '../../../../../common/Modal/ModalActions';

const mapStateToProps = (state) => ({
  cluster: state.clusters.details.cluster,
  addClusterAddOnResponse: state.addOns.addClusterAddOnResponse,
  deleteClusterAddOnResponse: state.addOns.deleteClusterAddOnResponse,
  submitClusterAddOnResponse: state.modal.data.isUpdateForm
    ? state.addOns.updateClusterAddOnResponse
    : state.addOns.addClusterAddOnResponse,
});

const mapDispatchToProps = {
  addClusterAddOn,
  openModal: modalActions.openModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddOnsDrawer);
