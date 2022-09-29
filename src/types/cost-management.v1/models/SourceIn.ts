/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Source } from './Source';

export type SourceIn = Source & {
  /**
   * Dictionary containing resource name.
   */
  authentication: any;
  /**
   * Dictionary containing billing source.
   */
  billing_source: any;
};
