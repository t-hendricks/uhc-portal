/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type openshift_version = {
    /**
     * Available CPU architectures.
     */
    cpu_architectures: Array<string>;
    /**
     * Indication that the version is the recommended one.
     */
    default?: boolean;
    /**
     * Name of the version to be presented to the user.
     */
    display_name: string;
    /**
     * Level of support of the version.
     */
    support_level: openshift_version.support_level;
};

export namespace openshift_version {

    /**
     * Level of support of the version.
     */
    export enum support_level {
        BETA = 'beta',
        PRODUCTION = 'production',
        MAINTENANCE = 'maintenance',
    }


}

