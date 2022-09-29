import { connect } from 'react-redux';
import CostCard from './CostCard';
import { getReport, getSources, getUserAccess } from '../../../redux/actions/costActions';

const mapDispatchToProps = {
  getReport,
  getSources,
  getUserAccess,
};

const mapStateToProps = (state) => ({
  report: state.cost.report,
  sources: state.cost.sources,
  userAccess: state.cost.userAccess,
});

export default connect(mapStateToProps, mapDispatchToProps)(CostCard);
