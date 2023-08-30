/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AddOnInstallation } from './AddOnInstallation';
import type { AWS } from './AWS';
import type { AWSInfrastructureAccessRoleGrant } from './AWSInfrastructureAccessRoleGrant';
import type { BillingModel } from './BillingModel';
import type { ByoOidc } from './ByoOidc';
import type { CCS } from './CCS';
import type { CloudProvider } from './CloudProvider';
import type { CloudRegion } from './CloudRegion';
import type { ClusterAPI } from './ClusterAPI';
import type { ClusterAutoscaler } from './ClusterAutoscaler';
import type { ClusterConsole } from './ClusterConsole';
import type { ClusterHealthState } from './ClusterHealthState';
import type { ClusterNodes } from './ClusterNodes';
import type { ClusterState } from './ClusterState';
import type { ClusterStatus } from './ClusterStatus';
import type { DeleteProtection } from './DeleteProtection';
import type { DNS } from './DNS';
import type { ExternalConfiguration } from './ExternalConfiguration';
import type { Flavour } from './Flavour';
import type { GCP } from './GCP';
import type { GCPEncryptionKey } from './GCPEncryptionKey';
import type { GCPNetwork } from './GCPNetwork';
import type { Group } from './Group';
import type { HTPasswdIdentityProvider } from './HTPasswdIdentityProvider';
import type { Hypershift } from './Hypershift';
import type { IdentityProvider } from './IdentityProvider';
import type { InflightCheck } from './InflightCheck';
import type { Ingress } from './Ingress';
import type { MachinePool } from './MachinePool';
import type { ManagedService } from './ManagedService';
import type { Network } from './Network';
import type { NodePool } from './NodePool';
import type { Product } from './Product';
import type { ProvisionShard } from './ProvisionShard';
import type { Proxy } from './Proxy';
import type { Subscription } from './Subscription';
import type { Value } from './Value';
import type { Version } from './Version';

/**
 * Definition of an _OpenShift_ cluster.
 *
 * The `cloud_provider` attribute is a reference to the cloud provider. When a
 * cluster is retrieved it will be a link to the cloud provider, containing only
 * the kind, id and href attributes:
 *
 * ```json
 * {
 * "cloud_provider": {
 * "kind": "CloudProviderLink",
 * "id": "123",
 * "href": "/api/clusters_mgmt/v1/cloud_providers/123"
 * }
 * }
 * ```
 *
 * When a cluster is created this is optional, and if used it should contain the
 * identifier of the cloud provider to use:
 *
 * ```json
 * {
 * "cloud_provider": {
 * "id": "123",
 * }
 * }
 * ```
 *
 * If not included, then the cluster will be created using the default cloud
 * provider, which is currently Amazon Web Services.
 *
 * The region attribute is mandatory when a cluster is created.
 *
 * The `aws.access_key_id`, `aws.secret_access_key` and `dns.base_domain`
 * attributes are mandatory when creation a cluster with your own Amazon Web
 * Services account.
 */
export type Cluster = {
  /**
   * Indicates the type of this object. Will be 'Cluster' if this is a complete object or 'ClusterLink' if it is just a link.
   */
  kind?: string;
  /**
   * Unique identifier of the object.
   */
  id?: string;
  /**
   * Self link.
   */
  href?: string;
  /**
   * Information about the API of the cluster.
   */
  api?: ClusterAPI;
  /**
   * Amazon Web Services settings of the cluster.
   */
  aws?: AWS;
  /**
   * List of AWS infrastructure access role grants on this cluster.
   */
  aws_infrastructure_access_role_grants?: Array<AWSInfrastructureAccessRoleGrant>;
  /**
   * Contains configuration of a Customer Cloud Subscription cluster.
   */
  ccs?: CCS;
  /**
   * DNS settings of the cluster.
   */
  dns?: DNS;
  /**
   * Create cluster that uses FIPS Validated / Modules in Process cryptographic libraries.
   */
  fips?: boolean;
  /**
   * Google cloud platform settings of the cluster.
   */
  gcp?: GCP;
  /**
   * Key used for encryption of GCP cluster nodes.
   */
  gcp_encryption_key?: GCPEncryptionKey;
  /**
   * GCP Network.
   */
  gcp_network?: GCPNetwork;
  /**
   * Additional trust bundle.
   */
  additional_trust_bundle?: string;
  /**
   * List of add-ons on this cluster.
   */
  addons?: Array<AddOnInstallation>;
  /**
   * Autoscaler.
   */
  autoscaler?: ClusterAutoscaler;
  /**
   * Billing model for cluster resources.
   */
  billing_model?: BillingModel;
  /**
   * Contains information about BYO OIDC.
   */
  byo_oidc?: ByoOidc;
  /**
   * Link to the cloud provider where the cluster is installed.
   */
  cloud_provider?: CloudProvider;
  /**
   * Information about the console of the cluster.
   */
  console?: ClusterConsole;
  /**
   * Date and time when the cluster was initially created, using the
   * format defined in [RFC3339](https://www.ietf.org/rfc/rfc3339.txt).
   */
  creation_timestamp?: string;
  /**
   * Delete protection
   */
  delete_protection?: DeleteProtection;
  /**
   * Indicates whether the User workload monitoring is enabled or not
   * It is enabled by default
   */
  disable_user_workload_monitoring?: boolean;
  /**
   * Indicates whether that etcd is encrypted or not.
   * This is set only during cluster creation.
   */
  etcd_encryption?: boolean;
  /**
   * Date and time when the cluster will be automatically deleted, using the format defined in
   * [RFC3339](https://www.ietf.org/rfc/rfc3339.txt). If no timestamp is provided, the cluster
   * will never expire.
   *
   * This option is unsupported.
   */
  expiration_timestamp?: string;
  /**
   * External identifier of the cluster, generated by the installer.
   */
  external_id?: string;
  /**
   * ExternalConfiguration shows external configuration on the cluster.
   */
  external_configuration?: ExternalConfiguration;
  /**
   * Link to the _flavour_ that was used to create the cluster.
   */
  flavour?: Flavour;
  /**
   * Link to the collection of groups of user of the cluster.
   */
  groups?: Array<Group>;
  /**
   * HealthState indicates the overall health state of the cluster.
   */
  health_state?: ClusterHealthState;
  /**
   * Details for `htpasswd` identity provider.
   */
  htpasswd?: HTPasswdIdentityProvider;
  /**
   * Hypershift configuration.
   */
  hypershift?: Hypershift;
  /**
   * Link to the collection of identity providers of the cluster.
   */
  identity_providers?: Array<IdentityProvider>;
  /**
   * List of inflight checks on this cluster.
   */
  inflight_checks?: Array<InflightCheck>;
  /**
   * InfraID is used for example to name the VPCs.
   */
  infra_id?: string;
  /**
   * List of ingresses on this cluster.
   */
  ingresses?: Array<Ingress>;
  /**
   * Load Balancer quota to be assigned to the cluster.
   */
  load_balancer_quota?: number;
  /**
   * List of machine pools on this cluster.
   */
  machine_pools?: Array<MachinePool>;
  /**
   * Flag indicating if the cluster is managed (by Red Hat) or
   * self-managed by the user.
   */
  managed?: boolean;
  /**
   * Contains information about Managed Service
   */
  managed_service?: ManagedService;
  /**
   * Flag indicating if the cluster should be created with nodes in
   * different availability zones or all the nodes in a single one
   * randomly selected.
   */
  multi_az?: boolean;
  /**
   * Name of the cluster. This name is assigned by the user when the
   * cluster is created.
   */
  name?: string;
  /**
   * Network settings of the cluster.
   */
  network?: Network;
  /**
   * Node drain grace period.
   */
  node_drain_grace_period?: Value;
  /**
   * List of node pools on this cluster.
   * NodePool is a scalable set of worker nodes attached to a hosted cluster.
   */
  node_pools?: Array<NodePool>;
  /**
   * Information about the nodes of the cluster.
   */
  nodes?: ClusterNodes;
  /**
   * Version of _OpenShift_ installed in the cluster, for example `4.0.0-0.2`.
   *
   * When retrieving a cluster this will always be reported.
   *
   * When provisioning a cluster this will be ignored, as the version to
   * deploy will be determined internally.
   */
  openshift_version?: string;
  /**
   * Link to the product type of this cluster.
   */
  product?: Product;
  /**
   * User defined properties for tagging and querying.
   */
  properties?: Record<string, string>;
  /**
   * ProvisionShard contains the properties of the provision shard, including AWS and GCP related configurations
   */
  provision_shard?: ProvisionShard;
  /**
   * Proxy.
   */
  proxy?: Proxy;
  /**
   * Link to the cloud provider region where the cluster is installed.
   */
  region?: CloudRegion;
  /**
   * Overall state of the cluster.
   */
  state?: ClusterState;
  /**
   * Status of cluster
   */
  status?: ClusterStatus;
  /**
   * Storage quota to be assigned to the cluster.
   */
  storage_quota?: Value;
  /**
   * Link to the subscription that comes from the account management service when the cluster
   * is registered.
   */
  subscription?: Subscription;
  /**
   * Link to the version of _OpenShift_ that will be used to install the cluster.
   */
  version?: Version;
};
