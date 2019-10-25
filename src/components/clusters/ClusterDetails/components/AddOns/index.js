import { connect } from 'react-redux';
import AddOns from './AddOns';
import addOnsActions from './AddOnsActions';

const mapStateToProps = state => ({
  addOns: state.addOns.addOns,
  cluster: state.clusters.details.cluster,
  clusterAddOns: state.addOns.clusterAddOns,
  addClusterAddOnResponse: state.addOns.addClusterAddOnResponse,
  organization: state.userProfile.organization,
  quota: state.userProfile.organization.quotaList,
});

const mapDispatchToProps = {
  getClusterAddOns: addOnsActions.getClusterAddOns,
  addClusterAddOn: addOnsActions.addClusterAddOn,
  clearAddOnsResponses: addOnsActions.clearAddOnsResponses,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddOns);
