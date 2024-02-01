/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { List } from './List';
import type { NotifyDetailsResponse } from './NotifyDetailsResponse';

export type NotifyDetailsResponseList = List & {
  associates?: Array<string>;
  items?: Array<NotifyDetailsResponse>;
  recipients?: Array<string>;
};
