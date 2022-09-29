/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Error } from './Error';
import type { List } from './List';

export type ErrorList = List & {
  items?: Array<Error>;
};
