import { connect } from 'react-redux';
import SupportStatusLabel from './SupportStatusLabel';
import getSupportStatus from './supportStatusActions';

const mapStateToProps = (state) => ({
  lines: state.logs.lines,
  fulfilled: state.supportStatus.fulfilled,
  pending: state.supportStatus.pending,
  error: state.supportStatus.error,
  supportStatus: state.supportStatus.supportStatus,
});

const mapDispatchToProps = { getSupportStatus };

export default connect(mapStateToProps, mapDispatchToProps)(SupportStatusLabel);
