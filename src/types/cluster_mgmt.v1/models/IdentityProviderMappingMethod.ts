/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Controls how mappings are established between provider identities and user objects.
 */
export enum IdentityProviderMappingMethod {
    ADD = 'add',
    CLAIM = 'claim',
    GENERATE = 'generate',
    LOOKUP = 'lookup',
}
