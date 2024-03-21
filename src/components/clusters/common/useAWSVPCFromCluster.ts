import React from 'react';
import { AxiosResponse } from 'axios';

import { getAWSVPCDetails } from '~/services/clusterService';
import { CloudVPC, Cluster } from '~/types/clusters_mgmt.v1';
import {
  CloudProviderVPCRequest,
  getAWSCloudProviderVPCs,
} from '~/redux/actions/ccsInquiriesActions';
import { securityGroupsSort } from '~/redux/reducers/ccsInquiriesReducer';
import { isHypershiftCluster } from '~/components/clusters/common/clusterStates';

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

const fetchVpcByClusterId = async (clusterId: string) => {
  let vpc;
  const result = await getAWSVPCDetails(clusterId, { includeSecurityGroups: true });
  if (result.data?.id) {
    vpc = result.data;
  }
  return vpc;
};

const fetchVpcByStsCredentials = async (vpcRequestMemo: CloudProviderVPCRequest) => {
  const vpcList = await getAWSCloudProviderVPCs(vpcRequestMemo).payload;
  return readVpcFromList(vpcList);
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
  const isHypershift = isHypershiftCluster(cluster);
  const clusterId = cluster.id || '';
  const subnetIds = cluster.aws?.subnet_ids || [];
  const isBYOVPC = subnetIds.length > 0;

  const manageVpcFetch = async (vpcPromise: Promise<CloudVPC | undefined>) => {
    setHasError(false);
    setIsLoading(true);
    try {
      const vpc = await vpcPromise;
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

  // Fetches the VPC by the cluster's id
  React.useEffect(() => {
    const loadVpcByClusterId = async () => manageVpcFetch(fetchVpcByClusterId(clusterId));
    if (clusterId && !isHypershift && isBYOVPC) {
      loadVpcByClusterId();
    }
  }, [clusterId, isHypershift, isBYOVPC]);

  // Fetches the VPC by the cluster's STS credentials
  // The dependencies are the primitive values - if we use an object the event will trigger even when no data has changed.
  const subnetId = subnetIds.length > 0 ? subnetIds[0] : undefined;
  const roleArn = cluster.aws?.sts?.role_arn;
  const regionId = cluster.region?.id || '';

  React.useEffect(() => {
    const loadVpcByStsCredentials = async () => {
      const request = {
        awsCredentials: { sts: { role_arn: roleArn } },
        region: regionId,
        subnet: subnetId,
        options: { includeSecurityGroups: isHypershift },
      };
      return manageVpcFetch(fetchVpcByStsCredentials(request));
    };
    if (isHypershift && roleArn && subnetId && regionId) {
      loadVpcByStsCredentials();
    }
  }, [isHypershift, subnetId, roleArn, regionId]);

  return { clusterVpc, isLoading, hasError };
};
