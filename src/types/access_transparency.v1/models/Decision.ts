/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ObjectReference } from './ObjectReference';
export type Decision = ObjectReference & {
  /**
   * The username of the individual that made this Decision
   */
  decided_by?: string;
  /**
   * The Decision made
   */
  decision?: Decision.decision;
  /**
   * A human-readable explanation as to why this Decision was made. Optional for Approved Decisions.
   */
  justification?: string;
};
export namespace Decision {
  /**
   * The Decision made
   */
  export enum decision {
    APPROVED = 'Approved',
    DENIED = 'Denied',
    EXPIRED = 'Expired',
  }
}
