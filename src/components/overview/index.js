import { connect } from 'react-redux';
import Overview from './Overview';
import { getSummaryDashboard } from '../../redux/actions/dashboardsActions';
import { invalidateSubscriptions } from '../../redux/actions/subscriptionsActions';

const mapDispatchToProps = {
  getSummaryDashboard,
  invalidateSubscriptions,
};

const mapStateToProps = state => ({
  dashboards: state.dashboards,
});

export default connect(mapStateToProps, mapDispatchToProps)(Overview);
