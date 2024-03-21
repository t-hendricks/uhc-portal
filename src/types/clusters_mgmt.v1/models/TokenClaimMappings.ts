/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { GroupsClaim } from './GroupsClaim';
import type { UsernameClaim } from './UsernameClaim';

/**
 * The claim mappings defined for users and groups.
 */
export type TokenClaimMappings = {
  /**
   * Groups is a name of the claim that should be used to construct groups for the cluster identity.
   */
  groups?: GroupsClaim;
  /**
   * Username is a name of the claim that should be used to construct usernames for the cluster identity.
   */
  username?: UsernameClaim;
};
