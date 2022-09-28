/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { List } from './List';
import type { RegistryCredential } from './RegistryCredential';

export type RegistryCredentialList = List & {
  items?: Array<RegistryCredential>;
};
