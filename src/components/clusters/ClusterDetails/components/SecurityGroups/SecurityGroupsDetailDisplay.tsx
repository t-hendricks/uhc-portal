import React from 'react';
import { Link } from 'react-router-dom';
import { SecurityGroup, MachinePool } from '~/types/clusters_mgmt.v1';
import {
  MachinePoolItemList,
  securityGroupsRenderer,
} from '~/components/clusters/ClusterDetails/components/MachinePools/components/MachinePoolExpandedRow';

const getCombinedMachinePoolSecurityGroupIds = (machinePoolData: MachinePool[]): string[] => {
  // Step through the machine pools and combine the security groups into single array
  const securityGroups: string[] = [];
  machinePoolData.forEach((mp) => {
    if (mp?.aws?.additional_security_group_ids?.length ?? 0) {
      securityGroups.push(...(mp?.aws?.additional_security_group_ids || []));
    }
  });
  // Remove duplicates
  return [...new Set(securityGroups)];
};
const SecurityGroupsDisplayByNode = ({
  securityGroups = [],
  securityGroupIdsForControl = [],
  securityGroupIdsForInfra = [],
  machinePoolData = [],
  showLinkToMachinePools = false,
  showWorkerNodesTogether = false,
}: {
  securityGroups?: SecurityGroup[] | undefined;
  securityGroupIdsForControl?: string[];
  securityGroupIdsForInfra?: string[];
  machinePoolData?: MachinePool[];
  showLinkToMachinePools?: boolean;
  showWorkerNodesTogether?: boolean;
}) => (
  <>
    {securityGroupIdsForControl.length > 0 && (
      <dd key="sg-detail-display-controlplane-nodes">
        <MachinePoolItemList
          title="Control plane nodes"
          items={securityGroupsRenderer(securityGroupIdsForControl, securityGroups || [])}
          showSmallTitle
        />
      </dd>
    )}
    {securityGroupIdsForControl.length > 0 && (
      <dd key="sg-detail-display-infra-nodes">
        <MachinePoolItemList
          title="Infrastructure nodes"
          items={securityGroupsRenderer(securityGroupIdsForInfra, securityGroups || [])}
          showSmallTitle
        />
      </dd>
    )}

    {!showWorkerNodesTogether &&
      machinePoolData.map(
        (mp) =>
          (mp?.aws?.additional_security_group_ids?.length || 0) > 0 && (
            <dd key={`sg-detail-display-compute-nodes-${mp?.id}`}>
              <MachinePoolItemList
                title={`Compute (${mp?.id}) nodes `}
                items={securityGroupsRenderer(
                  mp?.aws?.additional_security_group_ids || [],
                  securityGroups || [],
                )}
                showSmallTitle
              />
            </dd>
          ),
      )}
    {showWorkerNodesTogether && (
      <dd key="sg-detail-display-all-compute-nodes">
        <MachinePoolItemList
          title={`Compute nodes `}
          items={securityGroupsRenderer(
            getCombinedMachinePoolSecurityGroupIds(machinePoolData) || [],
            securityGroups || [],
          )}
          showSmallTitle
        />
      </dd>
    )}

    {showLinkToMachinePools && getCombinedMachinePoolSecurityGroupIds(machinePoolData).length > 0 && (
      <dt>
        See more information in the <Link to="#machinePools">machine pools tab</Link>
      </dt>
    )}
  </>
);

export default SecurityGroupsDisplayByNode;
