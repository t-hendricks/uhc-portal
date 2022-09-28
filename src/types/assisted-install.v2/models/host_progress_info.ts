/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { host_stage } from './host_stage';

export type host_progress_info = {
  current_stage?: host_stage;
  installation_percentage?: number;
  progress_info?: string;
  /**
   * Time at which the current progress stage started.
   */
  stage_started_at?: string;
  /**
   * Time at which the current progress stage was last updated.
   */
  stage_updated_at?: string;
};
