/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TagRate = {
  readonly uuid?: string;
  metric: Record<string, any>;
  cost_type?: TagRate.cost_type;
  description?: string;
  tag_rates?: any;
};
export namespace TagRate {
  export enum cost_type {
    INFRASTRUCTURE = 'Infrastructure',
    SUPPLEMENTARY = 'Supplementary',
  }
}
