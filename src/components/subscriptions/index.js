import { connect } from 'react-redux';

import { subscriptionsActions } from '../../redux/actions/subscriptionsActions';
import Subscriptions from './Subscriptions';

const mapDispatchToProps = {
  fetchAccount: () => subscriptionsActions.fetchAccount(),
};

function mapStateToProps(state) {
  return {
    account: state.subscriptions.account,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Subscriptions);
