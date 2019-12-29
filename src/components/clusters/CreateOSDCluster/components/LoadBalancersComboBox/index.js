import { connect } from 'react-redux';
import getLoadBalancers from '../../../../../redux/actions/loadBalancerActions';
import LoadBalancersComboBox from './LoadBalancersComboBox';
import { getOrganizationAndQuota } from '../../../../../redux/actions/userActions';

const mapStateToProps = state => ({
  loadBalancerValues: state.loadBalancerValues.loadBalancerValues,
  organization: state.userProfile.organization,
  quota: state.userProfile.organization.quotaList,
});

const mapDispatchToProps = { getLoadBalancers, getOrganizationAndQuota };

export default connect(mapStateToProps, mapDispatchToProps)(LoadBalancersComboBox);
