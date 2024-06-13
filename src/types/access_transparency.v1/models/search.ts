/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Specifies the search criteria. The syntax of this parameter is
 * similar to the syntax of the _where_ clause of an SQL statement,
 * using the names of the json attributes / column names of the account.
 * For example, in order to retrieve all the accounts with a username
 * starting with `my`:
 *
 * ```sql
 * username like 'my%'
 * ```
 *
 * The search criteria can also be applied on related resource.
 * For example, in order to retrieve all the subscriptions labeled by `foo=bar`,
 *
 * ```sql
 * subscription_labels.key = 'foo' and subscription_labels.value = 'bar'
 * ```
 *
 * If the parameter isn't provided, or if the value is empty, then
 * all the accounts that the user has permission to see will be
 * returned.
 */
export type search = string;
