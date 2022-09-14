/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AWSFlavour } from './AWSFlavour';
import type { FlavourNodes } from './FlavourNodes';
import type { GCPFlavour } from './GCPFlavour';
import type { Network } from './Network';

/**
 * Set of predefined properties of a cluster. For example, a _huge_ flavour can be a cluster
 * with 10 infra nodes and 1000 compute nodes.
 */
export type Flavour = {
    /**
     * Indicates the type of this object. Will be 'Flavour' if this is a complete object or 'FlavourLink' if it is just a link.
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
     * Default _Amazon Web Services_ settings of the cluster.
     */
    aws?: AWSFlavour;
    /**
     * Default _Google Cloud Platform_ settings of the cluster.
     */
    gcp?: GCPFlavour;
    /**
     * Human friendly identifier of the cluster, for example `4`.
     *
     * NOTE: Currently for all flavours the `id` and `name` attributes have exactly the
     * same values.
     */
    name?: string;
    /**
     * Default network settings of the cluster.
     *
     * These can be overridden specifying in the cluster itself a different set of settings.
     */
    network?: Network;
    /**
     * Number of nodes that will be used by default when creating a cluster that uses
     * this flavour.
     *
     * These can be overridden specifying in the cluster itself a different number of nodes.
     */
    nodes?: FlavourNodes;
};

