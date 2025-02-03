import { connect } from 'react-redux';

import { modalActions } from '../../../../../common/Modal/ModalActions';
import { addClusterAddOn } from '../AddOnsActions';

import AddOnsCard from './AddOnsCard';

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
