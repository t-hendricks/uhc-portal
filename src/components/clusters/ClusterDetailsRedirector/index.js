import { connect } from 'react-redux';
import {
  fetchSubscriptionIDForCluster,
  clearSubscriptionIDForCluster,
} from '../../../redux/actions/subscriptionsActions';
import { setGlobalError } from '../../../redux/actions/globalErrorActions';

import ClusterDetailsRedirector from './ClusterDetailsRedirector';

const mapStateToProps = (state) => ({
  subscriptionIDResponse: state.subscriptions.subscriptionID,
});

const mapDispatchToProps = {
  fetchSubscriptionIDForCluster,
  clearSubscriptionIDForCluster,
  setGlobalError,
};

export default connect(mapStateToProps, mapDispatchToProps)(ClusterDetailsRedirector);
