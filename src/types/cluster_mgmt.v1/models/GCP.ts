/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Google cloud platform settings of a cluster.
 */
export type GCP = {
  /**
   * GCP authentication uri
   */
  auth_uri?: string;
  /**
   * GCP Authentication provider x509 certificate url
   */
  auth_provider_x509_cert_url?: string;
  /**
   * GCP client identifier
   */
  client_id?: string;
  /**
   * GCP client x509 certificate url
   */
  client_x509_cert_url?: string;
  /**
   * GCP client email
   */
  client_email?: string;
  /**
   * GCP private key
   */
  private_key?: string;
  /**
   * GCP private key identifier
   */
  private_key_id?: string;
  /**
   * GCP project identifier.
   */
  project_id?: string;
  /**
   * GCP token uri
   */
  token_uri?: string;
  /**
   * GCP the type of the service the key belongs to
   */
  type?: string;
};
