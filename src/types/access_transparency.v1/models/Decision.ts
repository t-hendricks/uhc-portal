/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ObjectReference } from './ObjectReference';
export type Decision = ObjectReference & {
  decided_by?: string;
  decision?: Decision.decision;
  justification?: string;
};
export namespace Decision {
  export enum decision {
    APPROVED = 'Approved',
    DENIED = 'Denied',
    EXPIRED = 'Expired',
  }
}
