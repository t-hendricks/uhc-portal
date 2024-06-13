import { Capability } from '~/types/accounts_mgmt.v1';

const capabilitiesWithExternalAuthentication: Capability[] = [
  {
    inherited: false,
    name: 'capability.organization.hcp_allow_external_authentication',
    value: 'true',
  },
  {
    inherited: false,
    name: 'capability.organization.restrict_offline_tokens',
    value: 'true',
  },
  {
    inherited: false,
    name: 'capability.cluster.subscribed_ocp',
    value: 'true',
  },
];

const capabilitiesWithoutExternalAuthentication: Capability[] = [
  {
    inherited: false,
    name: 'capability.organization.enable_data_sovereign_regions',
    value: 'true',
  },
  {
    inherited: false,
    name: 'capability.cluster.subscribed_ocp',
    value: 'true',
  },
];

export { capabilitiesWithExternalAuthentication, capabilitiesWithoutExternalAuthentication };
