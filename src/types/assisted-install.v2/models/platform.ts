/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ovirt_platform } from './ovirt_platform';
import type { platform_type } from './platform_type';

/**
 * The configuration for the specific platform upon which to perform the installation.
 */
export type platform = {
    ovirt?: ovirt_platform | null;
    type: platform_type;
};

