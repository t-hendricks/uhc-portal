import { connect } from 'react-redux';
import InstallationLogView from './InstallationLogView';
import { clearLogs, getLogs } from './InstallationLogActions';

const mapStateToProps = state => ({
  lines: state.logs.lines,
  pending: state.logs.pending,
});

const mapDispatchToProps = { clearLogs, getLogs };

export default connect(mapStateToProps, mapDispatchToProps)(InstallationLogView);
