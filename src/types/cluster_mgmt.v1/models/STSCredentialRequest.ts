/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { STSOperator } from './STSOperator';

/**
 * Representation of an credRequest
 */
export type STSCredentialRequest = {
    /**
     * Name of CredRequest
     */
    name?: string;
    /**
     * Operator Details
     */
    operator?: STSOperator;
};

