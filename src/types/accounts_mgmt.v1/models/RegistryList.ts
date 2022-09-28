/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { List } from './List';
import type { Registry } from './Registry';

export type RegistryList = List & {
  items?: Array<Registry>;
};
