/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { List } from './List';
import type { PullSecretRotation } from './PullSecretRotation';

export type PullSecretRotationList = List & {
  items?: Array<PullSecretRotation>;
};
