/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TieredRate = {
  readonly uuid?: string;
  metric: Record<string, any>;
  'cost-type'?: TieredRate.CostType;
  description?: string;
  tiered_rates?: Array<any>;
};
export namespace TieredRate {
  export enum CostType {
    INFRASTRUCTURE = 'Infrastructure',
    SUPPLEMENTARY = 'Supplementary',
  }
}
