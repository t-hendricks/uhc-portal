import { normalizedProducts } from '../../../../../../common/subscriptionTypes';

const setSorting = jest.fn();
const openModal = jest.fn();

const clusters = [
  {
    id: '1HAtguRKqqlQYCSFk14uwMl6g6p',
    kind: 'Subscription',
    href: '/api/accounts_mgmt/v1/subscriptions/1HAtguRKqqlQYCSFk14uwMl6g6p',
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
      status: 'Deprovisioned',
      provenance: 'Provisioning',
      last_reconcile_date: '0001-01-01T00:00:00Z',
      last_released_at: '0001-01-01T00:00:00Z',
    },
  },
];

export { clusters, setSorting, openModal };
