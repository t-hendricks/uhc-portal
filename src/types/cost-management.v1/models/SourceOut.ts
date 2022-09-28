/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Source } from './Source';

export type SourceOut = Source & {
  id: number;
  uuid?: string;
  name?: string;
  source_type?: string;
  /**
   * Dictionary containing resource name.
   */
  authentication?: any;
  /**
   * Dictionary containing billing source.
   */
  billing_source?: any;
  /**
   * Flag to indicate if provider is linked to source.
   */
  provider_linked?: boolean;
  /**
   * Flag to indicate if provider is successfully configured.
   */
  active?: boolean;
  /**
   * Flag to indicate if provider is paused.
   */
  paused?: boolean;
  /**
   * Flag to indicate if provider has report data for the current month.
   */
  current_month_data?: boolean;
  /**
   * Flag to indicate if provider has report data for the previous month.
   */
  previous_month_data?: boolean;
  /**
   * Flag to indicate if provider has report data for any month.
   */
  has_data?: boolean;
  /**
   * Dictionary containing OpenShift foundational infrastructure type and uuid.
   */
  infrastructure?: any;
  /**
   * List of cost model name and UUIDs associated with this source.
   */
  cost_models?: Array<{
    uuid?: string;
    name?: string;
  }>;
  /**
   * Dictionary containing OpenShift foundational infrastructure type and uuid.
   */
  additional_context?: any;
};
