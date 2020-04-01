import get from 'lodash/get';
import { connect } from 'react-redux';

import getLoadBalancers from '../../../../redux/actions/loadBalancerActions';
import LoadBalancersDropdown from './LoadBalancersDropdown';

const mapStateToProps = (state, ownProps) => ({
  loadBalancerValues: state.loadBalancerValues,
  quota: get(state, `userProfile.organization.quotaList.loadBalancerQuota.${ownProps.cloudProviderID}.available`, 0),
});

const mapDispatchToProps = { getLoadBalancers };

export default connect(mapStateToProps, mapDispatchToProps)(LoadBalancersDropdown);
