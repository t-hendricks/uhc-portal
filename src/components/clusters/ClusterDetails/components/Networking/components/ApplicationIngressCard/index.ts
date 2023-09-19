import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { GlobalState } from '~/redux/store';
import { LoadBalancerFlavor } from '~/types/clusters_mgmt.v1';

import { isHypershiftCluster } from '~/components/clusters/ClusterDetails/clusterDetailsHelper';
import { CloudProviderType } from '~/components/clusters/wizards/common';
import {
  canConfigureDayTwoManagedIngress,
  canConfigureLoadBalancer,
} from '~/components/clusters/wizards/rosa/constants';
import { isHibernating } from '../../../../../common/clusterStates';
import { openModal } from '../../../../../../common/Modal/ModalActions';
import ApplicationIngressCard from './ApplicationIngressCard';
import NetworkingSelector from '../../NetworkingSelector';

const mapStateToProps = (state: GlobalState) => {
  const { cluster } = state.clusters.details;
  const clusterRouters = NetworkingSelector(state);

  const provider = cluster.cloud_provider?.id;
  const isHypershift = isHypershiftCluster(cluster);
  const isAWS = provider === CloudProviderType.Aws;

  const { canEdit } = cluster;

  const isReadOnly = cluster?.status?.configuration_mode === 'read_only';
  // @ts-ignore
  const isSTSEnabled = cluster?.aws?.sts?.enabled === true;
  const clusterHibernating = isHibernating(cluster.state);
  const clusterVersion = cluster?.openshift_version || cluster?.version?.raw_id || '';
  const hasSufficientIngressEditVersion =
    !isHypershift && canConfigureDayTwoManagedIngress(clusterVersion);
  const canEditLoadBalancer = canConfigureLoadBalancer(clusterVersion, isSTSEnabled);
  const canShowLoadBalancer = isAWS && !isHypershift;

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
    canEditLoadBalancer,
    canShowLoadBalancer,
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
