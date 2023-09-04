import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { GlobalState } from '~/redux/store';
import { LoadBalancerFlavor } from '~/types/clusters_mgmt.v1';

import { isHypershiftCluster } from '~/components/clusters/ClusterDetails/clusterDetailsHelper';
import { canConfigureDayTwoManagedIngress } from '~/components/clusters/wizards/rosa/constants';
import { isHibernating } from '../../../../../common/clusterStates';
import { openModal } from '../../../../../../common/Modal/ModalActions';
import ApplicationIngressCard from './ApplicationIngressCard';
import NetworkingSelector from '../../NetworkingSelector';

const mapStateToProps = (state: GlobalState) => {
  const { cluster } = state.clusters.details;
  const clusterRouters = NetworkingSelector(state);

  const provider = cluster.cloud_provider?.id;
  const isHypershift = isHypershiftCluster(cluster);

  const { canEdit } = cluster;

  const isReadOnly = cluster?.status?.configuration_mode === 'read_only';
  const clusterHibernating = isHibernating(cluster.state);
  const hasSufficientIngressEditVersion = canConfigureDayTwoManagedIngress(
    cluster?.openshift_version || '',
  );
  const {
    routeSelectors,
    excludedNamespaces,
    loadBalancer,
    address,
    isPrivate,
    tlsSecretRef,
    isWildcardPolicyAllowed,
    isNamespaceOwnershipPolicyStrict,
    hostname,
  } = clusterRouters.default || {};

  return {
    provider,
    canEdit: !!canEdit,
    isReadOnly,
    isHypershift,
    clusterHibernating,

    isNLB: loadBalancer === LoadBalancerFlavor.NLB,
    hasSufficientIngressEditVersion,
    clusterRoutesTlsSecretRef: tlsSecretRef,
    clusterRoutesHostname: hostname,

    defaultRouterAddress: address,
    isDefaultRouterPrivate: isPrivate,

    defaultRouterSelectors: routeSelectors,
    defaultRouterExcludedNamespacesFlag: excludedNamespaces,
    isDefaultIngressWildcardPolicyAllowed: isWildcardPolicyAllowed,
    isDefaultRouterNamespaceOwnershipPolicyStrict: !!isNamespaceOwnershipPolicyStrict,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  openModal: (name: string) => dispatch(openModal(name)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationIngressCard);
