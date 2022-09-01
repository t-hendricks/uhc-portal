/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AddOnRequirementStatus } from './AddOnRequirementStatus';

/**
 * Representation of an add-on requirement.
 */
export type AddOnRequirement = {
    /**
     * ID of the add-on requirement.
     */
    id?: string;
    /**
     * Data for the add-on requirement.
     */
    data?: Record<string, any>;
    /**
     * Indicates if this requirement is enabled for the add-on.
     */
    enabled?: boolean;
    /**
     * Type of resource of the add-on requirement.
     */
    resource?: string;
    /**
     * Optional cluster specific status for the add-on.
     */
    status?: AddOnRequirementStatus;
};

