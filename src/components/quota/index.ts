import { connect } from 'react-redux';
import { subscriptionsActions } from '../../redux/actions/subscriptionsActions';
import { clustersActions } from '../../redux/actions/clustersActions';
import Quota from './Quota';
import { GlobalState } from '~/redux/store';

const mapDispatchToProps = {
  fetchAccount: () => subscriptionsActions.fetchAccount(),
  invalidateClusters: () => clustersActions.invalidateClusters(),
};

const mapStateToProps = (state: GlobalState) => ({
  account: state.subscriptions.account,
});

export default connect(mapStateToProps, mapDispatchToProps)(Quota);
