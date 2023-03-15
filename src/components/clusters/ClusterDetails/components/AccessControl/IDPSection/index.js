import { connect } from 'react-redux';
import { getClusterIdentityProviders } from '../../IdentityProvidersPage/IdentityProvidersActions';
import { openModal } from '../../../../../common/Modal/ModalActions';

import IDPSection from './IDPSection';

const mapStateToProps = (state) => ({
  identityProviders: state.identityProviders.clusterIdentityProviders,
  subscriptionID: state.clusters.details.cluster.subscription?.id,
});

const mapDispatchToProps = {
  getClusterIdentityProviders,
  openModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(IDPSection);
