/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { NodeType } from './NodeType';

/**
 * Provides information about a node from specific type in the cluster.
 */
export type NodeInfo = {
    /**
     * The amount of the nodes from this type.
     */
    amount?: number;
    /**
     * The Node type.
     */
    type?: NodeType;
};

