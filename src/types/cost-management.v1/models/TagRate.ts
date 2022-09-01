/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type TagRate = {
    readonly uuid?: string;
    metric: any;
    'cost-type'?: TagRate.'cost-type';
    description?: string;
    tag_rates?: any;
};

export namespace TagRate {

    export enum 'cost-type' {
        INFRASTRUCTURE = 'Infrastructure',
        SUPPLEMENTARY = 'Supplementary',
    }


}

