import { connect } from 'react-redux';
import { AddBareMetalHostsDialog } from 'facet-lib';

import { closeModal } from '../../../common/Modal/ModalActions';
import shouldShowModal from '../../../common/Modal/ModalSelectors';
import withFeatureGate from '../../../features/with-feature-gate';
import { ASSISTED_INSTALLER_FEATURE } from '../../../../redux/constants/featureConstants';

const mapStateToProps = (state) => {
  const cluster = state.modal.data;
  return ({
    isOpen: shouldShowModal(state, 'add-bare-metal-hosts'),
    cluster,
  });
};

const mapDispatchToProps = dispatch => ({
  closeModal: () => dispatch(closeModal()),
});

export default withFeatureGate(
  connect(mapStateToProps, mapDispatchToProps)(AddBareMetalHostsDialog),
  ASSISTED_INSTALLER_FEATURE,
  () => null,
);
