/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ObjectReference } from './ObjectReference';

export type Plan = ObjectReference & {
  category?: string;
  name?: string;
  type?: string;
};
