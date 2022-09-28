const clusterDetails = {
  error: false,
  errorMessage: '',
  errorDetails: null,
  pending: false,
  fulfilled: true,
  valid: true,
  cluster: {
    kind: 'Cluster',
    id: '1mqfbqa8o7cep4enq4dtostelskt5k38',
    href: '/api/clusters_mgmt/v1/clusters/1mqfbqa8o7cep4enq4dtostelskt5k38',
    name: 'noa-aug26',
    external_id: 'fake-cluster-acb1f0be-b60b-4124-b567-0f7d139da6f5',
    infra_id: 'fake-infra-id',
    display_name: 'noa-aug26',
    cloud_provider: {
      kind: 'CloudProviderLink',
      id: 'aws',
      href: '/api/clusters_mgmt/v1/cloud_providers/aws',
    },
    subscription: {
      id: '1xFud5sJArB3KRvAuxmd1ef9RE8',
      kind: 'Subscription',
      href: '/api/accounts_mgmt/v1/subscriptions/1xFud5sJArB3KRvAuxmd1ef9RE8',
      plan: {
        id: 'OSD',
        type: 'OSD',
      },
      cluster_id: '1mqfbqa8o7cep4enq4dtostelskt5k38',
      organization_id: '1MKVU4otCIuogoLtgtyU6wajxjW',
      support_level: 'Premium',
      display_name: 'test-idp',
      managed: true,
      cloud_provider_id: 'aws',
      cluster_billing_model: 'standard',
    },
    console: {
      url: 'https://https://example.com/veryfakewebconsole',
    },
    api: {
      url: 'https://example.com/veryfakeapi',
      listening: 'external',
    },
    state: 'ready',
    multi_az: false,
    managed: true,
  },
};

const clusterIDPs = {
  error: false,
  errorMessage: '',
  errorDetails: null,
  pending: false,
  fulfilled: true,
  clusterIDPList: [
    {
      kind: 'IdentityProvider',
      type: 'GithubIdentityProvider',
      href: '/api/clusters_mgmt/v1/clusters/1mqfbqa8o7cep4enq4dtostelskt5k38/identity_providers/1mqibnjsmkkf3q9tgdsimbua8esa1hjd',
      id: '1mqibnjsmkkf3q9tgdsimbua8esa1hjd',
      name: 'GitHub',
      mapping_method: 'claim',
      github: {
        client_id: 'asdasd',
        organizations: ['sdfsdf'],
      },
    },
  ],
};

const submitIDPResponse = {
  error: false,
  errorMessage: '',
  errorDetails: null,
  pending: false,
  fulfilled: false,
  data: {},
};

const match = {
  params: {
    id: '1xFud5sJArB3KRvAuxmd1ef9RE8',
    idpTypeName: 'google',
  },
};

const resetResponse = jest.fn();
const resetForm = jest.fn();
const setGlobalError = jest.fn();
const clearGlobalError = jest.fn();
const handleSubmit = jest.fn();
const change = jest.fn();
const fetchDetails = jest.fn();
const getClusterIDPs = jest.fn();
const funcs = {
  resetResponse,
  resetForm,
  setGlobalError,
  clearGlobalError,
  handleSubmit,
  change,
  fetchDetails,
  getClusterIDPs,
};

export { clusterDetails, submitIDPResponse, clusterIDPs, match, funcs };
