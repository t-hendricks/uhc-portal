import { normalizedProducts } from '../../../../../../common/subscriptionTypes';

const setSorting = jest.fn();
const openModal = jest.fn();

const clusters = [
  {
    id: '1HAtguRKqqlQYCSFk14uwMl6g6p',
    kind: 'Subscription',
    href: '/api/accounts_mgmt/v1/subscriptions/1HAtguRKqqlQYCSFk14uwMl6g6p',
    name: 'teset-cluster',
    canEdit: true,
    plan: {
      id: normalizedProducts.OCP,
    },
    cluster_id: '1HAtdkNPWql68fuOI7KvuyM4OTp',
    organization_id: '1HAIjRf0KAoWykFD2gexUhfngd0',
    last_telemetry_date: '0001-01-01T00:00:00Z',
    created_at: '2019-02-14T15:07:24.640289Z',
    updated_at: '2019-09-24T01:37:42.930173Z',
    support_level: 'Eval',
    creator: {
      id: '1G1ikKt3haukUjrUDvRVLZyfEnY',
      kind: 'Account',
      href: '/api/accounts_mgmt/v1/accounts/1G1ikKt3haukUjrUDvRVLZyfEnY',
      name: 'Elad Tabak',
      username: 'etabak_privileged_uhc_20012019',
      email: '***REMOVED***',
    },
    subscription: {
      id: '1HAtdkNPWql68fuOI7Kvuyk4OTp',
      managed: false,
      status: 'Archived',
      provenance: 'Provisioning',
      last_reconcile_date: '0001-01-01T00:00:00Z',
      last_released_at: '0001-01-01T00:00:00Z',
    },
    metrics: {
      arch: '',
      channel_info: '',
      cloud_provider: '',
      cluster_type: '',
      compute_nodes_cpu: {
        used: { value: 0, unit: '' },
        updated_timestamp: '',
        total: { value: 0, unit: '' },
      },
      compute_nodes_memory: {
        used: { value: 0, unit: '' },
        updated_timestamp: '',
        total: { value: 0, unit: '' },
      },
      compute_nodes_sockets: {
        used: { value: 0, unit: '' },
        updated_timestamp: '',
        total: { value: 0, unit: '' },
      },
      console_url: '',
      cpu: {
        used: { value: 0, unit: '' },
        updated_timestamp: '',
        total: { value: 0, unit: '' },
      },
      critical_alerts_firing: 0,
      memory: {
        total: { value: 0, unit: '' },
        updated_timestamp: '',
        used: { value: 0, unit: '' },
      },
      nodes: {
        total: 0,
        master: 0,
        compute: 0,
      },
      non_virt_nodes: 0,
      openshift_version: '',
      operating_system: '',
      operators_condition_failing: 0,
      region: '',
      sockets: {
        total: { value: 0, unit: '' },
        updated_timestamp: '',
        used: { value: 0, unit: '' },
      },
      state: 'N/A',
      state_description: '',
      storage: {
        total: { value: 0, unit: '' },
        updated_timestamp: '',
        used: { value: 0, unit: '' },
      },
      subscription_cpu_total: 0,
      subscription_obligation_exists: 0,
      subscription_socket_total: 0,
      upgrade: { available: false },
    },
  },
];

export { clusters, setSorting, openModal };
