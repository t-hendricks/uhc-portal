/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type import_cluster_params = {
  /**
   * The domain name used to reach the OpenShift cluster API.
   */
  api_vip_dnsname: string;
  /**
   * OpenShift cluster name.
   */
  name: string;
  /**
   * The id of the OCP cluster, that hosts will be added to
   */
  openshift_cluster_id: string;
  /**
   * Version of the OpenShift cluster.
   */
  openshift_version?: string;
};
