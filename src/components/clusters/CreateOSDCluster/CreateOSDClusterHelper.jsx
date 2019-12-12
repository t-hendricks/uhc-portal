const constants = {
  spinnerMessage: 'Do not refresh this page. This request may take a moment...',
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
  nodeCIDRHint: `An IP address allocation in CIDR format used by the OpenShift
    Container Platform installation program while installing the cluster.`,
  serviceCIDRHint: `An IP address allocation in CIDR format for services.
    OpenShiftSDN allows only one serviceNetwork block. The address block must
    not overlap with any other network block.`,
  podCIDRHint: `An IP address allocation in CIDR format from which Pod IPs are
    allocated. The OpenShiftSDN network plug-in supports multiple cluster networks.
    The address blocks for multiple cluster networks must not overlap. Select address
    pools large enough to fit your anticipated workload.`,
};

export default constants;
