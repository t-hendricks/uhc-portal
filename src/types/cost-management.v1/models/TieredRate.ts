/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type TieredRate = {
    readonly uuid?: string;
    metric: any;
    'cost-type'?: TieredRate.'cost-type';
    description?: string;
    tiered_rates?: Array<any>;
};

export namespace TieredRate {

    export enum 'cost-type' {
        INFRASTRUCTURE = 'Infrastructure',
        SUPPLEMENTARY = 'Supplementary',
    }


}

