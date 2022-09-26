/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type event = {
  category?: event.category;
  /**
   * Unique identifier of the cluster this event relates to.
   */
  cluster_id?: string | null;
  event_time: string;
  /**
   * Unique identifier of the host this event relates to.
   */
  host_id?: string | null;
  /**
   * Unique identifier of the infra-env this event relates to.
   */
  infra_env_id?: string | null;
  message: string;
  /**
   * Event Name.
   */
  name?: string;
  /**
   * Additional properties for the event in JSON format.
   */
  props?: string;
  /**
   * Unique identifier of the request that caused this event to occur.
   */
  request_id?: string;
  severity: event.severity;
};

export namespace event {
  export enum category {
    USER = 'user',
    METRICS = 'metrics',
  }

  export enum severity {
    INFO = 'info',
    WARNING = 'warning',
    ERROR = 'error',
    CRITICAL = 'critical',
  }
}
