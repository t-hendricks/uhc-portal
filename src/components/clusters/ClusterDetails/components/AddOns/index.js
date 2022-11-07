import { connect } from 'react-redux';
import AddOns from './AddOns';
import {
  getAddOns,
  getClusterAddOns,
  addClusterAddOn,
  clearClusterAddOnsResponses,
} from './AddOnsActions';
import { getOrganizationAndQuota } from '../../../../../redux/actions/userActions';
import { modalActions } from '../../../../common/Modal/ModalActions';
import { getMachinePools } from '../MachinePools/MachinePoolsActions';

const mapStateToProps = (state) => ({
  addOns: state.addOns.addOns,
  cluster: state.clusters.details.cluster,
  clusterAddOns: state.addOns.clusterAddOns,
  clusterMachinePools: state.machinePools.getMachinePools,
  addClusterAddOnResponse: state.addOns.addClusterAddOnResponse,
  updateClusterAddOnResponse: state.addOns.updateClusterAddOnResponse,
  deleteClusterAddOnResponse: state.addOns.deleteClusterAddOnResponse,
  organization: state.userProfile.organization,
  quota: state.userProfile.organization.quotaList,
});

const mapDispatchToProps = {
  getOrganizationAndQuota,
  getAddOns,
  getClusterAddOns,
  getMachinePools,
  addClusterAddOn,
  clearClusterAddOnsResponses,
  openModal: modalActions.openModal,
  closeModal: modalActions.closeModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddOns);
