/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AddOnConfig } from './AddOnConfig';
import type { AddOnParameter } from './AddOnParameter';
import type { AddOnRequirement } from './AddOnRequirement';
import type { AddOnSubOperator } from './AddOnSubOperator';

/**
 * Representation of an add-on version.
 */
export type AddOnVersion = {
    /**
     * Indicates the type of this object. Will be 'AddOnVersion' if this is a complete object or 'AddOnVersionLink' if it is just a link.
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
     * AvailableUpgrades is the list of versions this version can be upgraded to.
     */
    available_upgrades?: Array<string>;
    /**
     * The specific addon catalog source channel of packages
     */
    channel?: string;
    /**
     * Additional configs to be used by the addon once its installed in the cluster.
     */
    config?: AddOnConfig;
    /**
     * Indicates if this add-on version can be added to clusters.
     */
    enabled?: boolean;
    /**
     * List of parameters for this add-on version.
     */
    parameters?: Array<AddOnParameter>;
    /**
     * List of requirements for this add-on version.
     */
    requirements?: Array<AddOnRequirement>;
    /**
     * The catalog source image for this add-on version.
     */
    source_image?: string;
    /**
     * List of sub operators for this add-on version.
     */
    sub_operators?: Array<AddOnSubOperator>;
};

