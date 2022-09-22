/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Representation of a Taint set on a MachinePool in a cluster.
 */
export type Taint = {
    /**
     * The effect on the node for the pods matching the taint, i.e: NoSchedule, NoExecute, PreferNoSchedule.
     */
    effect?: string;
    /**
     * The key for the taint
     */
    key?: string;
    /**
     * The value for the taint.
     */
    value?: string;
};

