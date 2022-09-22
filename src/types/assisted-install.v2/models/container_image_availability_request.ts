/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type container_image_availability_request = {
    /**
     * List of image names to be checked.
     */
    images: Array<string>;
    /**
     * Positive number represents a timeout in seconds for a pull operation.
     */
    timeout?: number;
};

