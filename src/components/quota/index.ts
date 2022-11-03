import { connect } from 'react-redux';

import { subscriptionsActions } from '../../redux/actions/subscriptionsActions';
import { clustersActions } from '../../redux/actions/clustersActions';
import Quota from './Quota';

const mapDispatchToProps = {
  fetchAccount: () => subscriptionsActions.fetchAccount(),
  invalidateClusters: () => clustersActions.invalidateClusters(),
};

function mapStateToProps(state) {
  return {
    account: state.subscriptions.account,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Quota);
