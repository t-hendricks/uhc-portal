import { connect } from 'react-redux';
import CostBreakdownCard from './CostBreakdownCard';
import { getReport, getSources } from '../../../../../../redux/actions/costActions';

const mapDispatchToProps = {
  getReport,
  getSources,
};

const mapStateToProps = state => ({
  report: state.cost.report,
  sources: state.cost.sources,
});

// const mapDispatchToProps = dispatch => ({
//   getReport: params => dispatch(getReport(params)),
//   getSources: params => dispatch(getSources(params)),
// });

export default connect(mapStateToProps, mapDispatchToProps)(CostBreakdownCard);
