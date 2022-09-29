import { connect } from 'react-redux';
import InstallationLogView from './InstallationLogView';
import { clearLogs, getLogs } from './InstallationLogActions';
import shouldShowLogs from './shouldShowLogs';

const mapStateToProps = (state) => ({
  lines: state.logs.lines,
  len: state.logs.len,
  pending: state.logs.pending,
  errorCode: state.logs.errorCode,
  logType: state.logs.logType,
});

const mapDispatchToProps = { clearLogs, getLogs };

export { shouldShowLogs };
export default connect(mapStateToProps, mapDispatchToProps)(InstallationLogView);
