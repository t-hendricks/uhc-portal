const constants = {
  clusterNameHint: `The name of the cluster. This will be used when generating a sub-domain
    for your cluster on openshiftapps.com.`,
  availabilityHint: 'Deploy to a single data center or to multiple data centers.',
  regionHint: 'The data center where your worker pool will be located.',
  persistentStorageHint: 'The storage quota set on the deployed cluster.',
  loadBalancersHint: 'The load balancer quota set on the deployed cluster.',
  computeNodeInstanceTypeHint: `The instance type for the worker nodes. Instance type
    determines the amount of memory and vCPU allocated to each worker node.`,
  computeNodeCountHint: 'The number of worker nodes to provision per zone. The minimum number of worker nodes will vary depending on which features are enbled.',
  machinePoolComputeNodeCountHint: 'The number of worker nodes to provision per zone.',
  machineCIDRHint: `A block of IP addresses used by the OpenShift Container Platform installation
    program while installing the cluster. The address block must not overlap with any other network
    block.`,
  serviceCIDRHint: `A block of IP addresses for services. OpenShiftSDN allows only one
    serviceNetwork block. The address block must not overlap with any other network block.`,
  podCIDRHint: `A block of IP addresses from which Pod IP addresses are allocated. The OpenShiftSDN
    network plug-in supports multiple cluster networks. The address blocks for multiple cluster
    networks must not overlap.  Select address pools large enough to fit your anticipated workload.`,
  hostPrefixHint: `The subnet prefix length to assign to each individual node.  For example, if host
    prefix is set to /23, then each node is assigned a /23 subnet out of the given CIDR, allowing
    for 510 (2^(32 - 23) - 2) Pod IP addresses.`,
  bypassSCPChecksHint: `Some AWS Service Control Policies will cause installation to fail even if
    the credentials have the correct permissions. Disabling SCP checks allows installation to proceed.
    The SCP will still be enforced even if the checks are bypassed.`,
  enableEtcdHint: 'When you enable etcd encryption, encryption keys are created. These keys are rotated on a weekly basis.',
  autoscaleHint: 'Autoscaling automatically adds and removes nodes from the cluster based on resource requiremnts.',
  keyRing: 'A key ring organizes keys in a specific Google Cloud location and allows you to manage access control on groups of keys.',
  keyName: 'A cryptographic key is a resource that is used for encrypting and decrypting data or for producing and verifying digital signatures',
  keylocation: 'A key location represent the geographical regions where a Cloud KMS resource is stored and can be accessed.',
  kmsserviceAccount: 'Compute Engine default service account',
  enableUserWorkloadMonitoringHint: 'Monitor your own projects in isolation from Red Hat Site Reliability Engineer (SRE) platform metrics',
  enableUserWorkloadMonitoringHelp: 'This feature is enabled by default and provides monitoring for user-defined projects.'
  + 'This includes metrics provided through service endpoints in user-defined projects as well as pods running in user-defined projects.',
  cloudKMSTitle: 'Cloud Key Management Service',
  cloudKMS: 'Cloud KMS is a REST API that can use a key to encrypt, decrypt, or sign data such as secrets for storage.',
  amazonEBSTitle: 'Amazon EBS encryption',
  amazonEBS: 'A straight-forward encryption solution for your EBS resources associated with your EC2 instances.',
  awsKeyARN: 'The key ARN is the Amazon Resource Name (ARN) of a CMK. It is a unique, fully qualified identifier for the CMK. A key ARN includes the AWS account, Region, and the key ID.',
  privateLinkHint: 'To provide support, Red Hat Site Reliability Engineering (SRE) connects to the cluster using only AWS Private Link endpoints instead of public endpoints.  This option cannot be changed after a cluster is created.',
};

const billingModelConstants = {
  standard: 'Standard',
  customerCloudSubscription: 'Customer cloud subscription',
  standardText: 'Deploy in cloud provider accounts owned by Red Hat.',
  customerCloudSubscriptionText: 'Leverage your existing cloud provider discounts and settings.',
  resourceRequirementsLink: 'https://www.openshift.com/dedicated/ccs',
  scpDocumentationLink: 'https://www.openshift.com/dedicated/ccs',
  awsCredentialsWarning: 'Revoking these credentials in AWS will result in a loss of access to any cluster created with these credentials.',
};

export { constants, billingModelConstants };
