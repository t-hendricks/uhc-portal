import { connect } from 'react-redux';
import getLoadBalancers from '../../../../redux/actions/loadBalancerActions';
import LoadBalancersDropdown from './LoadBalancersDropdown';

const mapStateToProps = state => ({
  loadBalancerValues: state.loadBalancerValues,
  quota: state.userProfile.organization.quotaList,
});

const mapDispatchToProps = { getLoadBalancers };

export default connect(mapStateToProps, mapDispatchToProps)(LoadBalancersDropdown);
