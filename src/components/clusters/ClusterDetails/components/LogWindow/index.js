import { connect } from 'react-redux';
import LogWindow from './LogWindow';
import { getLogs } from './LogWindowActions';

const mapStateToProps = state => ({
  lines: state.logs.logs.lines,
});

const mapDispatchToProps = { getLogs };

export default connect(mapStateToProps, mapDispatchToProps)(LogWindow);
