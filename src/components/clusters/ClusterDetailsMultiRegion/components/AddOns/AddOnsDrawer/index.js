import { connect } from 'react-redux';

import { modalActions } from '../../../../../common/Modal/ModalActions';
import { addClusterAddOn, setAddonsDrawer, updateClusterAddOn } from '../AddOnsActions';

import AddOnsDrawer from './AddOnsDrawer';

const mapStateToProps = (state) => ({
  cluster: state.clusters.details.cluster,
  addClusterAddOnResponse: state.addOns.addClusterAddOnResponse,
  deleteClusterAddOnResponse: state.addOns.deleteClusterAddOnResponse,
  submitClusterAddOnResponse: state.modal.data.isUpdateForm
    ? state.addOns.updateClusterAddOnResponse
    : state.addOns.addClusterAddOnResponse,
  drawer: state.addOns.drawer,
});

const mapDispatchToProps = {
  addClusterAddOn,
  updateClusterAddOn,
  openModal: modalActions.openModal,
  setAddonsDrawer,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddOnsDrawer);
