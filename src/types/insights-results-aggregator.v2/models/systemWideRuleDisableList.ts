/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * List of all system-wide disabled rules
 */
export type systemWideRuleDisableList = {
    data?: Array<{
        created_at?: string;
        created_by?: string;
        justification?: string;
        rule?: string;
        updated_at?: string;
    }>;
    meta?: {
        count?: number;
    };
};

