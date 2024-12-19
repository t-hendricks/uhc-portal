import { connect } from 'react-redux';

import { getOrganizationAndQuota } from '../../../../../redux/actions/userActions';
import { modalActions } from '../../../../common/Modal/ModalActions';
import { getMachineOrNodePools } from '../MachinePools/MachinePoolsActions';

import AddOns from './AddOns';
import {
  addClusterAddOn,
  clearClusterAddOnsResponses,
  getAddOns,
  getClusterAddOns,
} from './AddOnsActions';

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
  getMachineOrNodePools,
  addClusterAddOn,
  clearClusterAddOnsResponses,
  openModal: modalActions.openModal,
  closeModal: modalActions.closeModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddOns);
