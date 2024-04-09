import { connect } from 'react-redux';

import { setGlobalError } from '../../../redux/actions/globalErrorActions';
import {
  clearSubscriptionIDForCluster,
  fetchSubscriptionIDForCluster,
} from '../../../redux/actions/subscriptionsActions';

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
