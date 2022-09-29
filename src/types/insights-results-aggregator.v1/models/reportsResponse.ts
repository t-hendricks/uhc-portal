/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { reportsComponent } from './reportsComponent';

/**
 * Reports for a set of clusters
 */
export type reportsResponse = {
  clusters?: Array<string>;
  errors?: string | null;
  generated_at?: string;
  reports?: Record<
    string,
    {
      analysis_metadata?: {
        execution_context?: string;
        finish?: string;
        plugin_sets?: Record<
          string,
          {
            commit?: string | null;
            version?: string;
          }
        >;
        start?: string;
      };
      fingerprints?: Array<string>;
      info?: Array<reportsComponent>;
      reports?: Array<reportsComponent>;
      skips?: Array<{
        details?: string;
        reason?: string;
        rule_fqdn?: string;
        type?: string;
      }>;
      system?: {
        hostname?: string | null;
        metadata?: any;
      };
    }
  >;
  status?: string;
};
