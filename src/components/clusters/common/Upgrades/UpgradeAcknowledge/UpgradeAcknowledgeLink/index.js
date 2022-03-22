import { connect } from 'react-redux';
import { getHasUnMetClusterAcks } from '../UpgradeAcknowledgeSelectors';
import UpgradeAcknowledgeLink from './UpgradeAcknowledgeLink';

const mapStateToProps = state => ({
  hasAcks: getHasUnMetClusterAcks(state),
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(UpgradeAcknowledgeLink);
