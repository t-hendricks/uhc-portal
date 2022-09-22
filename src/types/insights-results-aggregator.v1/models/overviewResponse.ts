/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type overviewResponse = {
    overview?: {
        /**
         * Number of clusters with at least 1 Insights hit.
         */
        clusters_hit?: number;
        hit_by_risk?: Record<string, number>;
        hit_by_tag?: Record<string, number>;
    };
    status?: string;
};

