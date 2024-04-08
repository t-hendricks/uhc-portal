/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Specifies the search criteria. The syntax of this parameter is
 * similar to the syntax of the _where_ clause of an SQL statement,
 * using the names of the json attributes / column names of the account.
 * For example, in order to retrieve all the accounts with a username starting with `my`:
 *
 * ```sql
 * username like 'my%'
 * ```
 *
 * > **Important Note**:
 * Account Management Service uses **KSUID** as an **ID** field.
 * KSUID contains a timestamp component that allows them to be sorted by generation time.
 * As this field uses an index, please use it to sort by instead of `created_at` field.
 *
 * The search criteria can also be applied on related resource.
 * For example, in order to retrieve all the subscriptions labeled by `foo=bar`,
 *
 * ```sql
 * labels.key = 'foo' and labels.value = 'bar'
 * ```
 *
 * If the parameter isn't provided, or if the value is empty, then
 * all the accounts that the user has permission to see will be
 * returned.
 */
export type search = string;
