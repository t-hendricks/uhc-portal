/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Overall state of a cluster.
 */
export enum ClusterState {
    ERROR = 'error',
    HIBERNATING = 'hibernating',
    INSTALLING = 'installing',
    PENDING = 'pending',
    POWERING_DOWN = 'powering_down',
    READY = 'ready',
    RESUMING = 'resuming',
    UNINSTALLING = 'uninstalling',
    UNKNOWN = 'unknown',
    VALIDATING = 'validating',
    WAITING = 'waiting',
}
