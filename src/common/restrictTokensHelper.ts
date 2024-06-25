import { Capability } from '~/types/accounts_mgmt.v1';

// in case of error when checking if using offline tokens is restricted, default to showing offline tokens.
const defaultToOfflineTokens = true;

const hasRestrictTokensCapability = (capabilities: Array<Capability>) =>
  !!capabilities?.length &&
  capabilities.some(
    (capability) =>
      capability.name === 'capability.organization.restrict_offline_tokens' &&
      capability.value === 'true',
  );

export { defaultToOfflineTokens, hasRestrictTokensCapability };
