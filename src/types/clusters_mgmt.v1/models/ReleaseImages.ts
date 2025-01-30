/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ReleaseImageDetails } from './ReleaseImageDetails';
export type ReleaseImages = {
  /**
   * Arm64 will contain the reference for the arm64 image which will be used for cluster deployments
   */
  arm64?: ReleaseImageDetails;
  /**
   * Multi will contain the reference for the multi image which will be used for cluster deployments
   */
  multi?: ReleaseImageDetails;
};
