import { connect } from 'react-redux';
import AddOnsDrawer from './AddOnsDrawer';
import {
  addClusterAddOn,
  updateClusterAddOn,
  setSubscriptionModel,
  setAddonsDrawer,
} from '../AddOnsActions';
import { modalActions } from '../../../../../common/Modal/ModalActions';

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
  setSubscriptionModel,
  openModal: modalActions.openModal,
  setAddonsDrawer,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddOnsDrawer);
