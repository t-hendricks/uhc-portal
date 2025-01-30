/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AzureControlPlaneManagedIdentity } from './AzureControlPlaneManagedIdentity';
import type { AzureDataPlaneManagedIdentity } from './AzureDataPlaneManagedIdentity';
import type { AzureServiceManagedIdentity } from './AzureServiceManagedIdentity';
/**
 * Represents the information related to Azure User-Assigned managed identities
 * needed to perform Operators authentication based on Azure User-Assigned
 * Managed Identities
 */
export type AzureOperatorsAuthenticationManagedIdentities = {
  /**
   * The set of Azure User-Assigned Managed Identities leveraged for the
   * Control Plane operators of the cluster. The set of required managed
   * identities is dependent on the Cluster's OpenShift version.
   * Immutable
   */
  control_plane_operators_managed_identities?: Record<string, AzureControlPlaneManagedIdentity>;
  /**
   * The set of Azure User-Assigned Managed Identities leveraged for the
   * Data Plane operators of the cluster. The set of required managed
   * identities is dependent on the Cluster's OpenShift version.
   * Immutable.
   */
  data_plane_operators_managed_identities?: Record<string, AzureDataPlaneManagedIdentity>;
  /**
   * The Managed Identities Data Plane Identity URL associated with the
   * cluster. It is the URL that will be used to communicate with the
   * Managed Identities Resource Provider (MI RP).
   * Required during creation.
   * Immutable.
   */
  managed_identities_data_plane_identity_url?: string;
  /**
   * The Azure User-Assigned Managed Identity used to perform service
   * level actions. Specifically:
   * - Add Federated Identity Credentials to the identities in
   * `data_plane_operators_managed_identities` that belong to Data
   * Plane Cluster Operators
   * - Perform permissions validation for the BYOVNet related resources
   * associated to the Cluster
   * Required during creation.
   * Immutable.
   */
  service_managed_identity?: AzureServiceManagedIdentity;
};
