import { connect } from 'react-redux';
import get from 'lodash/get';
import Overview from './Overview';
import { getSummaryDashboard } from '../../redux/actions/dashboardsActions';
import { invalidateSubscriptions } from '../../redux/actions/subscriptionsActions';

const mapDispatchToProps = {
  getSummaryDashboard,
  invalidateSubscriptions,
};

const mapStateToProps = state => ({
  summaryDashboard: state.dashboards.summary,

  // summary dashboard contain only one {time, value} pair - the current value.
  totalClusters: get(state.dashboards.summary, 'metrics.clusters_total[0].value', 0),
  totalConnectedClusters: get(state.dashboards.summary, 'metrics.connected_clusters_total[0].value', 0),
  totalUnhealthyClusters: get(state.dashboards.summary, 'metrics.unhealthy_clusters_total[0].value', 0),
  totalCPU: get(state.dashboards.summary, 'metrics.sum_total_cpu[0]', { value: 0 }),
  usedCPU: get(state.dashboards.summary, 'metrics.sum_used_cpu[0]', { value: 0 }),
  totalMem: get(state.dashboards.summary, 'metrics.sum_total_memory[0]', { value: 0 }),
  usedMem: get(state.dashboards.summary, 'metrics.sum_used_memory[0]', { value: 0 }),
  upToDate: get(state.dashboards.summary, 'metrics.clusters_up_to_date_total[0]', { value: 0 }),
  upgradeAvailable: get(state.dashboards.summary, 'metrics.clusters_upgrade_available_total[0]', { value: 0 }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Overview);
