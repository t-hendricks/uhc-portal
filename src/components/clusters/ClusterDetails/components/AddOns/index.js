import { connect } from 'react-redux';
import AddOns from './AddOns';
import { getClusterAddOns, addClusterAddOn, clearClusterAddOnsResponses } from './AddOnsActions';
import { getOrganizationAndQuota } from '../../../../../redux/actions/userActions';
import { modalActions } from '../../../../common/Modal/ModalActions';

const mapStateToProps = state => ({
  addOns: state.addOns.addOns,
  cluster: state.clusters.details.cluster,
  clusterAddOns: state.addOns.clusterAddOns,
  addClusterAddOnResponse: state.addOns.addClusterAddOnResponse,
  organization: state.userProfile.organization,
  quota: state.userProfile.organization.quotaList,
});

const mapDispatchToProps = {
  getOrganizationAndQuota,
  getClusterAddOns,
  addClusterAddOn,
  clearClusterAddOnsResponses,
  openModal: modalActions.openModal,
  closeModal: modalActions.closeModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddOns);
