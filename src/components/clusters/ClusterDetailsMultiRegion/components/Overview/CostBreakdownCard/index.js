import { connect } from 'react-redux';

import { getReport, getSources } from '../../../../../../redux/actions/costActions';

import CostBreakdownCard from './CostBreakdownCard';

const mapDispatchToProps = {
  getReport,
  getSources,
};

const mapStateToProps = (state) => ({
  report: state.cost.report,
  sources: state.cost.sources,
});

export default connect(mapStateToProps, mapDispatchToProps)(CostBreakdownCard);
