import { connect } from 'react-redux';
import LogWindow from './LogWindow';
import { clearLogs } from './LogWindowActions';

const mapStateToProps = state => ({
  lines: state.logs.logs.lines,
});

const mapDispatchToProps = { clearLogs };

export default connect(mapStateToProps, mapDispatchToProps)(LogWindow);
