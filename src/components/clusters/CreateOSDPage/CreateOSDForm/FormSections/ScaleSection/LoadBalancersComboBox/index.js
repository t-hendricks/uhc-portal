import { connect } from 'react-redux';
import getLoadBalancers from '../../../../../../../redux/actions/loadBalancerActions';
import LoadBalancersComboBox from './LoadBalancersComboBox';

const mapStateToProps = state => ({
  loadBalancerValues: state.loadBalancerValues.loadBalancerValues,
  quota: state.userProfile.organization.quotaList,
});

const mapDispatchToProps = { getLoadBalancers };

export default connect(mapStateToProps, mapDispatchToProps)(LoadBalancersComboBox);
