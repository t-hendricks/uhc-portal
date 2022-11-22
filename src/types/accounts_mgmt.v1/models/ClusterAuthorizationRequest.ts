/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ReservedResource } from './ReservedResource';

export type ClusterAuthorizationRequest = {
  account_username: string;
  availability_zone?: string;
  byoc?: boolean;
  cloud_account_id?: string;
  cloud_provider_id?: string;
  cluster_id: string;
  disconnected?: boolean;
  display_name?: string;
  external_cluster_id?: string;
  managed?: boolean;
  product_category?: ClusterAuthorizationRequest.product_category;
  product_id?: ClusterAuthorizationRequest.product_id;
  quota_version?: string;
  reserve?: boolean;
  resources?: Array<ReservedResource>;
};

export namespace ClusterAuthorizationRequest {
  export enum product_category {
    ASSISTED_INSTALL = 'assistedInstall',
    HOSTED_CONTROL_PLANE = 'HostedControlPlane',
  }

  export enum product_id {
    OCP = 'OCP',
    OSD = 'OSD',
    OSDTRIAL = 'OSDTrial',
    MOA = 'MOA',
    RHMI = 'RHMI',
    RHOSAK = 'RHOSAK',
    RHOSAKTRIAL = 'RHOSAKTrial',
    RHOSR = 'RHOSR',
    RHOSRTRIAL = 'RHOSRTrial',
    RHOSE = 'RHOSE',
    RHOSETRIAL = 'RHOSETrial',
    RHACS = 'RHACS',
    RHACSTRIAL = 'RHACSTrial',
    ARO = 'ARO',
  }
}
