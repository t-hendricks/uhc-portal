/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TieredRate = {
  readonly uuid?: string;
  metric: Record<string, any>;
  cost_type?: TieredRate.cost_type;
  description?: string;
  tiered_rates?: Array<any>;
};
export namespace TieredRate {
  export enum cost_type {
    INFRASTRUCTURE = 'Infrastructure',
    SUPPLEMENTARY = 'Supplementary',
  }
}
