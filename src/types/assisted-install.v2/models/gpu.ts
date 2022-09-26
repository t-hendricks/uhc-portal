/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type gpu = {
  /**
   * Device address (for example "0000:00:02.0")
   */
  address?: string;
  /**
   * ID of the device (for example "3ea0")
   */
  device_id?: string;
  /**
   * Product name of the device (for example "UHD Graphics 620 (Whiskey Lake)")
   */
  name?: string;
  /**
   * The name of the device vendor (for example "Intel Corporation")
   */
  vendor?: string;
  /**
   * ID of the vendor (for example "8086")
   */
  vendor_id?: string;
};
