import { connect } from 'react-redux';
import { getClusterIdentityProviders } from '../../IdentityProvidersModal/IdentityProvidersActions';
import { openModal } from '../../../../../common/Modal/ModalActions';

import IDPSection from './IDPSection';

const mapStateToProps = state => ({
  identityProviders: state.identityProviders.clusterIdentityProviders,
});

const mapDispatchToProps = {
  getClusterIdentityProviders,
  openModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(IDPSection);
