import { clusterService } from '../../../../../services';
import {
  LoadBalancerFlavor,
  NamespaceOwnershipPolicy,
  WildcardPolicy,
} from '../../../../../types/clusters_mgmt.v1';
import { createDefaultRouterRequest, sendNetworkConfigRequests } from './NetworkingActions';

jest.mock('../../../../../services');

describe('createDefaultRouterRequest', () => {
  test('handles empty data', () => {
    const newData = {}; // by the user
    const currentData = { default: { routerID: 'router-id' } }; // by the API

    expect(createDefaultRouterRequest(newData, currentData)).toEqual({
      id: 'router-id',
    });
  });

  test('sets visibility', () => {
    const newData = { private_default_router: undefined }; // by the user
    const currentData = { default: { routerID: 'router-id' } }; // by the API

    newData.private_default_router = true;
    expect(createDefaultRouterRequest(newData, currentData)).toEqual({
      id: 'router-id',
      listening: 'internal',
    });

    newData.private_default_router = false;
    expect(createDefaultRouterRequest(newData, currentData)).toEqual({
      id: 'router-id',
      listening: 'external',
    });

    newData.private_default_router = false;
    currentData.default.isPrivate = true;
    expect(createDefaultRouterRequest(newData, currentData)).toEqual({
      id: 'router-id',
      listening: 'external',
    });
  });

  test('does not send visibility', () => {
    const newData = { private_default_router: undefined }; // by the user
    const currentData = { default: { routerID: 'router-id' } }; // by the API

    expect(createDefaultRouterRequest(newData, currentData)).toEqual({
      id: 'router-id',
    });

    newData.private_default_router = true;
    currentData.default.isPrivate = true;
    expect(createDefaultRouterRequest(newData, currentData)).toEqual({
      id: 'router-id',
    });

    newData.private_default_router = false;
    currentData.default.isPrivate = false;
    expect(createDefaultRouterRequest(newData, currentData)).toEqual({
      id: 'router-id',
    });
  });

  test('defaultRouterSelectors', () => {
    const newData = { defaultRouterSelectors: undefined }; // by the user
    const currentData = { default: { routerID: 'router-id' } }; // by the API

    newData.defaultRouterSelectors = 'foo=bar';
    expect(createDefaultRouterRequest(newData, currentData)).toEqual({
      id: 'router-id',
      route_selectors: {
        foo: 'bar',
      },
    });

    newData.defaultRouterSelectors = 'foo=bar,aa=bb';
    expect(createDefaultRouterRequest(newData, currentData)).toEqual({
      id: 'router-id',
      route_selectors: {
        foo: 'bar',
        aa: 'bb',
      },
    });

    newData.defaultRouterSelectors = 'foo=bar';
    currentData.default.routeSelectors = {};
    expect(createDefaultRouterRequest(newData, currentData)).toEqual({
      id: 'router-id',
      route_selectors: {
        foo: 'bar',
      },
    });

    newData.defaultRouterSelectors = '';
    currentData.default.routeSelectors = {
      foo: 'bar',
    };
    expect(createDefaultRouterRequest(newData, currentData)).toEqual({
      id: 'router-id',
      route_selectors: {},
    });

    newData.defaultRouterSelectors = 'aa=bb';
    currentData.default.routeSelectors = {
      foo: 'bar',
    };
    expect(createDefaultRouterRequest(newData, currentData)).toEqual({
      id: 'router-id',
      route_selectors: { aa: 'bb' },
    });
  });

  test('does not set route_selectors in request', () => {
    const newData = { defaultRouterSelectors: undefined }; // by the user
    const currentData = { default: { routerID: 'router-id' } }; // by the API

    expect(createDefaultRouterRequest(newData, currentData)).toEqual({
      id: 'router-id',
    });

    newData.defaultRouterSelectors = '';
    expect(createDefaultRouterRequest(newData, currentData)).toEqual({
      id: 'router-id',
    });

    newData.defaultRouterSelectors = '';
    currentData.default.routeSelectors = {};
    expect(createDefaultRouterRequest(newData, currentData)).toEqual({
      id: 'router-id',
    });
  });

  test('sets route_namespace_ownership_policy', () => {
    const newData = { isDefaultRouterNamespaceOwnershipPolicyStrict: undefined }; // by the user
    const currentData = { default: { routerID: 'router-id' } }; // by the API

    newData.isDefaultRouterNamespaceOwnershipPolicyStrict = true;
    expect(createDefaultRouterRequest(newData, currentData)).toEqual({
      id: 'router-id',
      route_namespace_ownership_policy: NamespaceOwnershipPolicy.STRICT,
    });

    newData.isDefaultRouterNamespaceOwnershipPolicyStrict = false;
    expect(createDefaultRouterRequest(newData, currentData)).toEqual({
      id: 'router-id',
      route_namespace_ownership_policy: NamespaceOwnershipPolicy.INTER_NAMESPACE_ALLOWED,
    });

    newData.isDefaultRouterNamespaceOwnershipPolicyStrict = false;
    currentData.default.isNamespaceOwnershipPolicyStrict = true;
    expect(createDefaultRouterRequest(newData, currentData)).toEqual({
      id: 'router-id',
      route_namespace_ownership_policy: NamespaceOwnershipPolicy.INTER_NAMESPACE_ALLOWED,
    });
  });

  test('does not send route_namespace_ownership_policy', () => {
    const newData = { isDefaultRouterNamespaceOwnershipPolicyStrict: undefined }; // by the user
    const currentData = { default: { routerID: 'router-id' } }; // by the API

    expect(createDefaultRouterRequest(newData, currentData)).toEqual({
      id: 'router-id',
    });

    newData.isDefaultRouterNamespaceOwnershipPolicyStrict = true;
    currentData.default.isNamespaceOwnershipPolicyStrict = true;
    expect(createDefaultRouterRequest(newData, currentData)).toEqual({
      id: 'router-id',
    });

    newData.isDefaultRouterNamespaceOwnershipPolicyStrict = false;
    currentData.default.isNamespaceOwnershipPolicyStrict = false;
    expect(createDefaultRouterRequest(newData, currentData)).toEqual({
      id: 'router-id',
    });
  });

  test('sets route_wildcard_policy', () => {
    const newData = { isDefaultRouterWildcardPolicyAllowed: undefined }; // by the user
    const currentData = { default: { routerID: 'router-id' } }; // by the API

    newData.isDefaultRouterWildcardPolicyAllowed = true;
    expect(createDefaultRouterRequest(newData, currentData)).toEqual({
      id: 'router-id',
      route_wildcard_policy: WildcardPolicy.WILDCARDS_ALLOWED,
    });

    newData.isDefaultRouterWildcardPolicyAllowed = false;
    expect(createDefaultRouterRequest(newData, currentData)).toEqual({
      id: 'router-id',
      route_wildcard_policy: WildcardPolicy.WILDCARDS_DISALLOWED,
    });

    newData.isDefaultRouterWildcardPolicyAllowed = false;
    currentData.default.isWildcardPolicyAllowed = true;
    expect(createDefaultRouterRequest(newData, currentData)).toEqual({
      id: 'router-id',
      route_wildcard_policy: WildcardPolicy.WILDCARDS_DISALLOWED,
    });
  });

  test('does not send route_wildcard_policy', () => {
    const newData = { isDefaultRouterWildcardPolicyAllowed: undefined }; // by the user
    const currentData = { default: { routerID: 'router-id' } }; // by the API

    expect(createDefaultRouterRequest(newData, currentData)).toEqual({
      id: 'router-id',
    });

    newData.isDefaultRouterWildcardPolicyAllowed = true;
    currentData.default.isWildcardPolicyAllowed = true;
    expect(createDefaultRouterRequest(newData, currentData)).toEqual({
      id: 'router-id',
    });

    newData.isDefaultRouterWildcardPolicyAllowed = false;
    currentData.default.isWildcardPolicyAllowed = false;
    expect(createDefaultRouterRequest(newData, currentData)).toEqual({
      id: 'router-id',
    });
  });

  test('sets load_balancer_type', () => {
    const newData = { is_nlb_load_balancer: undefined }; // by the user
    const currentData = { default: { routerID: 'router-id' } }; // by the API

    newData.is_nlb_load_balancer = true;
    expect(createDefaultRouterRequest(newData, currentData)).toEqual({
      id: 'router-id',
      load_balancer_type: LoadBalancerFlavor.NLB,
    });

    newData.is_nlb_load_balancer = false;
    currentData.default.loadBalancer = LoadBalancerFlavor.NLB;
    expect(createDefaultRouterRequest(newData, currentData)).toEqual({
      id: 'router-id',
      load_balancer_type: LoadBalancerFlavor.CLASSIC,
    });

    newData.is_nlb_load_balancer = true;
    currentData.default.loadBalancer = LoadBalancerFlavor.CLASSIC;
    expect(createDefaultRouterRequest(newData, currentData)).toEqual({
      id: 'router-id',
      load_balancer_type: LoadBalancerFlavor.NLB,
    });
  });

  test('does not send load_balancer_type', () => {
    const newData = { is_nlb_load_balancer: undefined }; // by the user
    const currentData = { default: { routerID: 'router-id' } }; // by the API

    expect(createDefaultRouterRequest(newData, currentData)).toEqual({
      id: 'router-id',
    });

    newData.is_nlb_load_balancer = false;
    expect(createDefaultRouterRequest(newData, currentData)).toEqual({
      id: 'router-id',
    });

    newData.is_nlb_load_balancer = true;
    currentData.default.loadBalancer = LoadBalancerFlavor.NLB;
    expect(createDefaultRouterRequest(newData, currentData)).toEqual({
      id: 'router-id',
    });

    newData.is_nlb_load_balancer = false;
    currentData.default.loadBalancer = LoadBalancerFlavor.CLASSIC;
    expect(createDefaultRouterRequest(newData, currentData)).toEqual({
      id: 'router-id',
    });
  });

  test('sets cluster_routes_tls_secret_ref', () => {
    const newData = { clusterRoutesTlsSecretRef: undefined }; // by the user
    const currentData = { default: { routerID: 'router-id' } }; // by the API

    newData.clusterRoutesTlsSecretRef = 'tls-ref';
    expect(createDefaultRouterRequest(newData, currentData)).toEqual({
      id: 'router-id',
      cluster_routes_tls_secret_ref: 'tls-ref',
    });

    newData.clusterRoutesTlsSecretRef = '';
    currentData.default.tlsSecretRef = 'foo';
    expect(createDefaultRouterRequest(newData, currentData)).toEqual({
      id: 'router-id',
      cluster_routes_tls_secret_ref: '',
    });

    newData.clusterRoutesTlsSecretRef = 'bar';
    currentData.default.tlsSecretRef = 'foo';
    expect(createDefaultRouterRequest(newData, currentData)).toEqual({
      id: 'router-id',
      cluster_routes_tls_secret_ref: 'bar',
    });
  });

  test('does not send cluster_routes_tls_secret_ref', () => {
    const newData = { clusterRoutesTlsSecretRef: undefined }; // by the user
    const currentData = { default: { routerID: 'router-id' } }; // by the API

    expect(createDefaultRouterRequest(newData, currentData)).toEqual({
      id: 'router-id',
    });

    newData.clusterRoutesTlsSecretRef = '';
    expect(createDefaultRouterRequest(newData, currentData)).toEqual({
      id: 'router-id',
    });

    newData.clusterRoutesTlsSecretRef = '';
    currentData.default.tlsSecretRef = '';
    expect(createDefaultRouterRequest(newData, currentData)).toEqual({
      id: 'router-id',
    });

    newData.clusterRoutesTlsSecretRef = 'foo';
    currentData.default.tlsSecretRef = 'foo';
    expect(createDefaultRouterRequest(newData, currentData)).toEqual({
      id: 'router-id',
    });
  });

  test('sets cluster_routes_hostname', () => {
    const newData = { clusterRoutesHostname: undefined }; // by the user
    const currentData = { default: { routerID: 'router-id' } }; // by the API

    newData.clusterRoutesHostname = 'hostname';
    expect(createDefaultRouterRequest(newData, currentData)).toEqual({
      id: 'router-id',
      cluster_routes_hostname: 'hostname',
    });

    newData.clusterRoutesHostname = '';
    currentData.default.hostname = 'foo';
    expect(createDefaultRouterRequest(newData, currentData)).toEqual({
      id: 'router-id',
      cluster_routes_hostname: '',
    });

    newData.clusterRoutesHostname = 'bar';
    currentData.default.hostname = 'foo';
    expect(createDefaultRouterRequest(newData, currentData)).toEqual({
      id: 'router-id',
      cluster_routes_hostname: 'bar',
    });

    newData.clusterRoutesHostname = 'bar';
    newData.clusterRoutesTlsSecretRef = 'zzz';
    currentData.default.hostname = 'foo';
    expect(createDefaultRouterRequest(newData, currentData)).toEqual({
      id: 'router-id',
      cluster_routes_hostname: 'bar',
      cluster_routes_tls_secret_ref: 'zzz',
    });
  });

  test('does not send cluster_routes_hostname', () => {
    const newData = { clusterRoutesHostname: undefined }; // by the user
    const currentData = { default: { routerID: 'router-id' } }; // by the API

    expect(createDefaultRouterRequest(newData, currentData)).toEqual({
      id: 'router-id',
    });

    newData.clusterRoutesHostname = '';
    expect(createDefaultRouterRequest(newData, currentData)).toEqual({
      id: 'router-id',
    });

    newData.clusterRoutesHostname = '';
    currentData.default.hostname = '';
    expect(createDefaultRouterRequest(newData, currentData)).toEqual({
      id: 'router-id',
    });

    newData.clusterRoutesHostname = 'foo';
    currentData.default.hostname = 'foo';
    expect(createDefaultRouterRequest(newData, currentData)).toEqual({
      id: 'router-id',
    });
  });

  test('can combine multiple fields', () => {
    const newData = {}; // by the user
    const currentData = { default: { routerID: 'router-id' } }; // by the API

    newData.isDefaultRouterWildcardPolicyAllowed = true;
    newData.clusterRoutesHostname = 'bar';
    newData.clusterRoutesTlsSecretRef = 'zzz';
    newData.is_nlb_load_balancer = false;
    newData.defaultRouterSelectors = 'foo=bar';

    expect(createDefaultRouterRequest(newData, currentData)).toEqual({
      id: 'router-id',
      route_wildcard_policy: WildcardPolicy.WILDCARDS_ALLOWED,
      cluster_routes_hostname: 'bar',
      cluster_routes_tls_secret_ref: 'zzz',
      route_selectors: {
        foo: 'bar',
      },
    });
  });
});

const success = {
  status: 200,
  // So far we do not need more data in the response
};

describe('sendNetworkConfigRequests', () => {
  let mockDispatch;
  beforeEach(() => {
    clusterService.editIngress.mockResolvedValue(success);
    mockDispatch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('calls clusterService.editIngress', async () => {
    const newData = {}; // by the user
    const currentData = { default: { routerID: 'router-id' } }; // by the API

    newData.isDefaultRouterWildcardPolicyAllowed = true;
    await sendNetworkConfigRequests(newData, currentData, 'cluster-id', mockDispatch);

    expect(clusterService.editIngress).toHaveBeenCalled();
  });

  test('should not call clusterService.editIngress', async () => {
    const newData = {}; // by the user
    const currentData = { default: { routerID: 'router-id' } }; // by the API

    await sendNetworkConfigRequests(newData, currentData, 'cluster-id', mockDispatch);

    expect(clusterService.editIngress).not.toHaveBeenCalled();
  });

  test('changes Cluster API', async () => {
    clusterService.editCluster.mockResolvedValue({ status: 204 });

    const newData = {}; // by the user
    const currentData = { default: { routerID: 'router-id' } }; // by the API

    newData.private_api = true;
    currentData.APIPrivate = false;

    newData.isDefaultRouterWildcardPolicyAllowed = true;

    await sendNetworkConfigRequests(newData, currentData, 'cluster-id', mockDispatch);

    expect(clusterService.editCluster).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledTimes(1);

    expect(clusterService.editIngress).toHaveBeenCalledTimes(1);
  });
});
