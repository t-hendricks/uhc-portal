import { connect } from 'react-redux';
import UpgradeAcknowledgeWarning from './UpgradeAcknowledgeWarning';
import { modalActions } from '../../../../../common/Modal/ModalActions';
import {
  getClusterIdFromState,
  getFromVersionFromState,
  getToVersionFromState,
  getClusterAcks,
  getIsManual,
  getClusterOpenShiftVersion,
  getHasScheduledManual,
} from '../UpgradeAcknowledgeSelectors';

const mapStateToProps = state => ({
  clusterId: getClusterIdFromState(state),
  openshiftVersion: getClusterOpenShiftVersion(state),
  fromVersion: getFromVersionFromState(state),
  toVersion: getToVersionFromState(state),
  isManual: getIsManual(state),
  getAcks: getClusterAcks(state),
  hasScheduledManual: getHasScheduledManual(state),
});

const mapDispatchToProps = {
  openModal: modalActions.openModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(UpgradeAcknowledgeWarning);
