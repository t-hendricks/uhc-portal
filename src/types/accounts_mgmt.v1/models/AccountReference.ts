/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ObjectReference } from './ObjectReference';

export type AccountReference = ObjectReference & {
  email?: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  username?: string;
};
