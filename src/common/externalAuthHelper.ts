import { Capability } from '~/types/accounts_mgmt.v1';

export const hasExternalAuthenticationCapability = (capabilities?: Capability[]) =>
  !!capabilities?.length &&
  capabilities.some(
    (capability) =>
      capability.name === 'capability.organization.hcp_allow_external_authentication' &&
      capability.value === 'true',
  );
