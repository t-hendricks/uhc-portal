import { connect } from 'react-redux';

import { subscriptionsActions } from '../../redux/actions/subscriptionsActions';
import { clustersActions } from '../../redux/actions/clustersActions';
import Subscriptions from './Subscriptions';

const mapDispatchToProps = {
  fetchAccount: () => subscriptionsActions.fetchAccount(),
  invalidateClusters: () => clustersActions.invalidateClusters(),
};

function mapStateToProps(state) {
  return {
    account: state.subscriptions.account,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Subscriptions);
