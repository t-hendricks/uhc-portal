/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ObjectReference } from './ObjectReference';

export type Error = ObjectReference & {
  code?: string;
  operation_id?: string;
  reason?: string;
};
