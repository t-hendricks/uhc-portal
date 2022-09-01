/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DetectionType } from './DetectionType';
import type { LimitedSupportReasonTemplate } from './LimitedSupportReasonTemplate';

/**
 * A reason that a cluster is in limited support.
 */
export type LimitedSupportReason = {
    /**
     * Indicates the type of this object. Will be 'LimitedSupportReason' if this is a complete object or 'LimitedSupportReasonLink' if it is just a link.
     */
    kind?: string;
    /**
     * Unique identifier of the object.
     */
    id?: string;
    /**
     * Self link.
     */
    href?: string;
    /**
     * The time the reason was detected.
     */
    creation_timestamp?: string;
    /**
     * URL with a link to a detailed description of the reason.
     */
    details?: string;
    /**
     * Indicates if the reason was detected automatically or manually.
     * When creating a new reason this field should be empty or "manual".
     */
    detection_type?: DetectionType;
    /**
     * Summary of the reason.
     */
    summary?: string;
    /**
     * Optional link to a template with summary and details.
     */
    template?: LimitedSupportReasonTemplate;
};

