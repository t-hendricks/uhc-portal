const constants = {
  clusterNameHint: `The name of the cluster. This will be used when generating a sub-domain
    for your cluster on openshiftapps.com.`,
  availabilityHint: 'Deploy to a single data center or to multiple data centers.',
  regionHint: 'The data center where your worker pool will be located.',
  persistentStorageHint: 'The storage quota set on the deployed cluster.',
  loadBalancersHint: 'The load balancer quota set on the deployed cluster.',
  computeNodeInstanceTypeHint: `The instance type for the compute nodes. Instance type
    determines the amount of memory and vCPU allocated to each compute node.`,
  computeNodeCountHint: `The number of compute, or worker, nodes to provision per zone.
    Single zone clusters require a minimum of 4 nodes, while multizone clusters require
    a minimum of 3 compute nodes per zone (9 total) for resiliency.`,
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
};

const billingModelConstants = {
  standard: 'Standard',
  customerCloudSubscription: 'Customer cloud subscription',
  standardText: 'Deploy in cloud provider accounts owned by Red Hat.',
  customerCloudSubscriptionText: 'Leverage your existing cloud provider discounts and settings.',
  resourceRequirementsLink: 'https://www.openshift.com/dedicated/ccs',
  scpDocumentationLink: 'https://www.openshift.com/dedicated/ccs',
  awsCredentialsWarning: 'The access credentials you provide here may only be used once. They may not be used to create another OpenShift Dedicated cluster.',
};

export { constants, billingModelConstants };
