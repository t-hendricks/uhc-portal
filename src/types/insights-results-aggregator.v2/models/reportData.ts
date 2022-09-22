/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * /clusters/{clusterId}/report returns an array of ruleHit instances
 */
export type reportData = {
    created_at?: string;
    /**
     * The title of the rule, a short description.
     */
    description?: string;
    /**
     * Details of the rule - templates rendered on frontend.
     */
    details?: string;
    disable_feedback?: string;
    /**
     * If this rule result disabled or not. This field can be used in the UI to show only specific set of rules results.
     */
    disabled?: boolean;
    disabled_at?: string;
    /**
     * Used as templating data for other content (details, resolution, etc.), has varying structure depending on the rules in the report.
     */
    extra_data?: any;
    /**
     * [Optional] Timestamp when the rule first started hitting
     */
    impacted?: string;
    internal?: boolean;
    /**
     * Non essential information.
     */
    more_info?: string;
    /**
     * Reason for the issue, giving the user more accurate description of the cause.
     */
    reason?: string;
    /**
     * Resolution steps of the issue, possibly linking to a resolution article in the knowledge base.
     */
    resolution?: string;
    /**
     * Risk of change - values paired with corresponding UI elements. 0 returned when not defined, therefore to hide the UI.
     */
    risk_of_change?: reportData.risk_of_change;
    /**
     * ID of a rule.
     */
    rule_id?: string;
    /**
     * List of tags that the rule contains, forming rule groups.
     */
    tags?: Array<string>;
    /**
     * Total risk - calculated from rule impact and likelihood.
     */
    total_risk?: reportData.total_risk;
    /**
     * User vote - value of user voting. -1 is dislike vote, 0 is no vote, 1 is like vote.
     */
    user_vote?: reportData.user_vote;
};

export namespace reportData {

    /**
     * Risk of change - values paired with corresponding UI elements. 0 returned when not defined, therefore to hide the UI.
     */
    export enum risk_of_change {
        '_0' = 0,
        '_1' = 1,
        '_2' = 2,
        '_3' = 3,
        '_4' = 4,
    }

    /**
     * Total risk - calculated from rule impact and likelihood.
     */
    export enum total_risk {
        '_0' = 0,
        '_1' = 1,
        '_2' = 2,
        '_3' = 3,
        '_4' = 4,
    }

    /**
     * User vote - value of user voting. -1 is dislike vote, 0 is no vote, 1 is like vote.
     */
    export enum user_vote {
        DISLIKE = '-1',
        NO_VOTE = '0',
        LIKE = '1',
    }


}

