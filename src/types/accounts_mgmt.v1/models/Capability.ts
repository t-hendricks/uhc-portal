/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ObjectReference } from './ObjectReference';

export type Capability = ObjectReference & {
  inherited: boolean;
  name: string;
  value: string;
};
