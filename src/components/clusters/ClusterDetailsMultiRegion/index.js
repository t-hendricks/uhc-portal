import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { toggleSubscriptionReleased } from '../../../redux/actions/subscriptionReleasedActions';

import ClusterDetails from './ClusterDetails';

// toggleSubscriptionReleased part of Actions menu story
const mapDispatchToProps = () =>
  bindActionCreators({
    toggleSubscriptionReleased,
  });

export default connect(undefined, mapDispatchToProps)(ClusterDetails);
