/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ruleContentErrorKey } from './ruleContentErrorKey';
import type { ruleContentPlugin } from './ruleContentPlugin';

export type ruleContent = {
  HasReason?: boolean;
  error_keys?: Record<string, ruleContentErrorKey>;
  generic?: string;
  more_info?: string;
  plugin?: ruleContentPlugin;
  reason?: string;
  resolution?: string;
  summary?: string;
};
