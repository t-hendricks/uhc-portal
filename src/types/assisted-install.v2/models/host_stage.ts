/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export enum host_stage {
    STARTING_INSTALLATION = 'Starting installation',
    WAITING_FOR_CONTROL_PLANE = 'Waiting for control plane',
    WAITING_FOR_BOOTKUBE = 'Waiting for bootkube',
    WAITING_FOR_CONTROLLER = 'Waiting for controller',
    INSTALLING = 'Installing',
    WRITING_IMAGE_TO_DISK = 'Writing image to disk',
    REBOOTING = 'Rebooting',
    WAITING_FOR_IGNITION = 'Waiting for ignition',
    CONFIGURING = 'Configuring',
    JOINED = 'Joined',
    DONE = 'Done',
    FAILED = 'Failed',
}
