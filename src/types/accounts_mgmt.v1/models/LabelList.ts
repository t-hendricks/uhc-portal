/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Label } from './Label';
import type { List } from './List';

export type LabelList = List & {
  items?: Array<Label>;
};
