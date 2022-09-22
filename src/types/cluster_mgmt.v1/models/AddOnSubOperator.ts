/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Representation of an add-on sub operator. A sub operator is an operator
 * who's life cycle is controlled by the add-on umbrella operator.
 */
export type AddOnSubOperator = {
    /**
     * Indicates if the sub operator is enabled for the add-on
     */
    enabled?: boolean;
    /**
     * Name of the add-on sub operator
     */
    operator_name?: string;
    /**
     * Namespace of the add-on sub operator
     */
    operator_namespace?: string;
};

