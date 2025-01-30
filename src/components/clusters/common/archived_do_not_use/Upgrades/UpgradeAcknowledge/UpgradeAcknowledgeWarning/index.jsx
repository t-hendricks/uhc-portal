import { connect } from 'react-redux';

import { modalActions } from '../../../../../../common/Modal/ModalActions';
import {
  getClusterAcks,
  getClusterIdFromState,
  getClusterOpenShiftVersion,
  getFromVersionFromState,
  getHasScheduledManual,
  getIsManual,
  getToVersionFromState,
  isManualUpdateSchedulingRequired,
} from '../UpgradeAcknowledgeSelectors';

import UpgradeAcknowledgeWarning from './UpgradeAcknowledgeWarning';

const mapStateToProps = (state) => ({
  clusterId: getClusterIdFromState(state),
  openshiftVersion: getClusterOpenShiftVersion(state),
  fromVersion: getFromVersionFromState(state),
  toVersion: getToVersionFromState(state),
  isManual: getIsManual(state),
  getAcks: getClusterAcks(state),
  hasScheduledManual: getHasScheduledManual(state),
  showManualUpgradeNeededWarning: isManualUpdateSchedulingRequired(state),
});

const mapDispatchToProps = {
  openModal: modalActions.openModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(UpgradeAcknowledgeWarning);
