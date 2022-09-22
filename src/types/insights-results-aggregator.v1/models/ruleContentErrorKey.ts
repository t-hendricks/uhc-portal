/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ruleContentErrorKey = {
    HasReason?: boolean;
    generic?: string;
    metadata?: {
        description?: string;
        impact?: string;
        likelihood?: ruleContentErrorKey.likelihood;
        publish_date?: string;
        status?: string;
        tags?: Array<string> | null;
    };
    more_info?: string;
    reason?: string;
    resolution?: string;
    summary?: string;
    total_risk?: ruleContentErrorKey.total_risk;
};

export namespace ruleContentErrorKey {

    export enum likelihood {
        '_0' = 0,
        '_1' = 1,
        '_2' = 2,
        '_3' = 3,
        '_4' = 4,
    }

    export enum total_risk {
        '_0' = 0,
        '_1' = 1,
        '_2' = 2,
        '_3' = 3,
        '_4' = 4,
    }


}

