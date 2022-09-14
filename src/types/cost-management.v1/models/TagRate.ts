/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type TagRate = {
    readonly uuid?: string;
    metric: any;
    'cost-type'?: TagRate.CostType;
    description?: string;
    tag_rates?: any;
};

export namespace TagRate {

    export enum CostType {
        INFRASTRUCTURE = 'Infrastructure',
        SUPPLEMENTARY = 'Supplementary',
    }


}

