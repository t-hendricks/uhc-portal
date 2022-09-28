/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type release_image = {
  /**
   * The CPU architecture of the image (x86_64/arm64/etc).
   */
  cpu_architecture: string;
  /**
   * Indication that the version is the recommended one.
   */
  default?: boolean;
  /**
   * Version of the OpenShift cluster.
   */
  openshift_version: string;
  /**
   * Level of support of the version.
   */
  support_level?: release_image.support_level;
  /**
   * The installation image of the OpenShift cluster.
   */
  url: string;
  /**
   * OCP version from the release metadata.
   */
  version: string;
};

export namespace release_image {
  /**
   * Level of support of the version.
   */
  export enum support_level {
    BETA = 'beta',
    PRODUCTION = 'production',
    MAINTENANCE = 'maintenance',
  }
}
