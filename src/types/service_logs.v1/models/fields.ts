/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Supplies a comma-separated list of fields to be returned.
 * Fields of sub-structures and of arrays use <structure>.<field>
 * notation.
 * <stucture>.* means all field of a structure
 * Example: For each Subscription to get id, href, plan(id and kind) and
 * labels (all fields)
 *
 * ```
 * ocm get subscriptions \
 * --parameter fields=id,href,plan.id,plan.kind,labels.* \
 * --parameter fetchLabels=true
 * ```
 */
export type fields = string;
