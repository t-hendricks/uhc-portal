/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Specifies the order by criteria. The syntax of this parameter is
 * similar to the syntax of the _order by_ clause of an SQL statement,
 * but using the names of the json attributes / column of the account.
 * For example, in order to retrieve all accounts ordered by username:
 *
 * ```sql
 * username asc
 * ```
 *
 * Or in order to retrieve all accounts ordered by username _and_ first name:
 *
 * ```sql
 * username asc, firstName asc
 * ```
 *
 * Parameters 'orderBy' and 'order' are mutually exclusive. If both
 * parameters aren't provided, or if the values are empty, then no
 * explicit ordering will be applied.
 */
export type order = string;
