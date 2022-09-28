/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type os_image = {
  /**
   * The CPU architecture of the image (x86_64/arm64/etc).
   */
  cpu_architecture: string;
  /**
   * Version of the OpenShift cluster.
   */
  openshift_version: string;
  /**
   * The OS rootfs url.
   */
  rootfs_url: string;
  /**
   * The base OS image used for the discovery iso.
   */
  url: string;
  /**
   * Build ID of the OS image.
   */
  version: string;
};
