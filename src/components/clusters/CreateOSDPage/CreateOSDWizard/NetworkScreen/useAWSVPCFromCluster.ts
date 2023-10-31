import React from 'react';
import { AxiosResponse } from 'axios';

import { getAWSVPCDetails } from '~/services/clusterService';
import { CloudVPC, Cluster } from '~/types/clusters_mgmt.v1';
import { isHypershiftCluster } from '~/components/clusters/common/clusterStates';
import { getAWSCloudProviderVPCs } from '~/components/clusters/CreateOSDPage/CreateOSDWizard/ccsInquiriesActions';
import { securityGroupsSort } from '~/components/clusters/CreateOSDPage/CreateOSDWizard/ccsInquiriesReducer';

/**
 * Builds the request necessary to retrieve a VPC by checking for one of its subnets
 * Is only available for:
 * - STS clusters ("aws.sts")
 * - BYO VPC ("aws.subnet_ids")
 *
 * @param cluster cluster for which we are searching for its VPC
 */
const vpcBySubnetRequest = (cluster: Cluster) => {
  const { subnet_ids: subnetIds, sts } = cluster?.aws || {};
  const subnet = subnetIds && subnetIds.length > 0 ? subnetIds[0] : undefined;
  const roleArn = sts?.role_arn;

  return !subnet || !roleArn
    ? undefined
    : {
        awsCredentials: { sts: { role_arn: roleArn } },
        region: cluster.region?.id || '',
        subnet,
      };
};

/**
 * Reads the response of VPCs associated to a given subnet.
 * A particular subnet should belong to a single VPC.
 * It shouldn't happen, but if the result contained more than 1 VPC, we wouldn't know which one the cluster uses.
 * @param vpcResponse
 */
const readVpcFromList = (
  vpcResponse: AxiosResponse<{
    items?: CloudVPC[] | undefined;
  }>,
): CloudVPC | undefined => {
  const vpcList = vpcResponse.data?.items || [];
  if (vpcList.length === 1) {
    return vpcList[0];
  }
  return undefined;
};

const adaptVPCDetails = (vpc: CloudVPC) => {
  const securityGroups = (vpc.aws_security_groups || []).filter((sg) => !sg.red_hat_managed);
  securityGroups.sort(securityGroupsSort);
  return { ...vpc, aws_security_groups: securityGroups };
};

/**
 * React hook for fetching the VPC of a BYO VPC cluster
 * - For Hypershift clusters, we cannot use the endpoint by clusterId.
 *  Security groups are not supported, so we don't include the option to retrieve them.
 * - For other BYO VPC clusters, we fetch the VPC by clusterId, including Security groups.
 * @param cluster the cluster to retrieve the VPC for
 * @returns vpc details.
 */
export const useAWSVPCFromCluster = (cluster: Cluster) => {
  const [clusterVpc, setClusterVpc] = React.useState<CloudVPC | undefined>();
  const [isLoading, setIsLoading] = React.useState<boolean>(!!cluster.id);
  const [hasError, setHasError] = React.useState<boolean>(false);
  const shouldFetchByClusterId = !isHypershiftCluster(cluster);
  const clusterId = cluster.id || '';
  const vpcRequest = React.useMemo(() => vpcBySubnetRequest(cluster), [cluster]);

  React.useEffect(() => {
    const fetchVpc = async () => {
      let vpc;
      if (shouldFetchByClusterId) {
        const result = await getAWSVPCDetails(clusterId, { includeSecurityGroups: true });
        if (result.data?.id) {
          vpc = result.data;
        }
      } else if (vpcRequest) {
        const vpcList = await getAWSCloudProviderVPCs(vpcRequest).payload;
        vpc = readVpcFromList(vpcList);
      }
      return vpc;
    };

    const loadData = async () => {
      setHasError(false);
      setIsLoading(true);
      try {
        const vpc = await fetchVpc();
        if (vpc) {
          setClusterVpc(adaptVPCDetails(vpc));
        }
      } catch {
        setHasError(true);
        setClusterVpc(undefined);
      } finally {
        setIsLoading(false);
      }
    };

    if (clusterId) {
      loadData();
    }
  }, [clusterId, shouldFetchByClusterId, vpcRequest]);

  return { clusterVpc, isLoading, hasError };
};
