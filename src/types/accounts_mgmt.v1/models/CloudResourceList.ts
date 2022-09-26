/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CloudResource } from './CloudResource';
import type { List } from './List';

export type CloudResourceList = List & {
  items?: Array<CloudResource>;
};
