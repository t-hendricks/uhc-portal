import React from 'react';
import { Alert, AlertActionLink, AlertVariant, Spinner } from '@patternfly/react-core';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import semver from 'semver';
import { GlobalState } from '~/redux/store';
import ExternalLink from '~/components/common/ExternalLink';
import { NodePool } from '~/types/clusters_mgmt.v1/models/NodePool';
import links from '~/common/installLinks.mjs';
import { useFeatureGate } from '~/hooks/useFeatureGate';
import { HCP_USE_NODE_UPGRADE_POLICIES } from '~/redux/constants/featureConstants';
import { isHypershiftCluster } from '../../../clusterDetailsHelper';
import { getMachineOrNodePools } from '../MachinePoolsActions';

import {
  updateAllMachinePools as updateAllPools,
  useHCPControlPlaneUpdating,
  controlPlaneVersionSelector,
  controlPlaneIdSelector,
  compareIsMachinePoolBehindControlPlane,
  isControlPlaneValidForMachinePool,
  isMachinePoolUpgrading,
  isMachinePoolScheduleError,
} from './updateMachinePoolsHelpers';

const UpdateAllMachinePools = ({
  initialErrorMessage, // introduced for testing purposes
  goToMachinePoolTab,
}: {
  initialErrorMessage?: string;
  goToMachinePoolTab?: boolean;
}) => {
  const dispatch = useDispatch();
  const [pending, setPending] = React.useState(false);
  const [errors, setErrors] = React.useState<string[]>(
    initialErrorMessage ? [initialErrorMessage] : [],
  );

  const useNodeUpdatePolicies = useFeatureGate(HCP_USE_NODE_UPGRADE_POLICIES);

  const controlPlaneUpdating = useHCPControlPlaneUpdating();

  const clusterId = useSelector(controlPlaneIdSelector);

  const controlPlaneVersion = useSelector((state: GlobalState) =>
    controlPlaneVersionSelector(state),
  );
  const machinePools = useSelector((state: GlobalState) => state.machinePools?.getMachinePools);
  const isHypershift = useSelector((state: GlobalState) =>
    isHypershiftCluster(state.clusters.details.cluster),
  );

  if (controlPlaneUpdating) {
    return null;
  }

  const machinePoolsToUpdate =
    machinePools.data?.filter(
      (pool: NodePool) =>
        compareIsMachinePoolBehindControlPlane(controlPlaneVersion, pool.version?.id) &&
        isControlPlaneValidForMachinePool(pool, controlPlaneVersion) &&
        !isMachinePoolScheduleError(pool) &&
        !isMachinePoolUpgrading(pool),
    ) || [];

  if (machinePoolsToUpdate.length === 0) {
    return null;
  }

  const updateNodePools = async () => {
    setPending(true);
    const errors = await updateAllPools(
      machinePoolsToUpdate,
      clusterId,
      controlPlaneVersion,
      useNodeUpdatePolicies,
    );
    setPending(false);
    setErrors(errors);
    dispatch(
      getMachineOrNodePools(
        clusterId,
        isHypershift,
        controlPlaneVersion,
        useNodeUpdatePolicies,
      ) as any,
    );
  };

  return (
    <>
      {!pending && errors.length > 0 ? (
        <Alert
          title="Some machine pools could not be updated"
          variant={AlertVariant.danger}
          isExpandable
          isInline
          role="alert"
          className="pf-v5-u-mt-md"
          data-testid="alert-danger"
        >
          {errors.map((error, index) => (
            // There isn't another accessible unique key
            // eslint-disable-next-line react/no-array-index-key
            <p key={index}>{error}</p>
          ))}
        </Alert>
      ) : null}
      <Alert
        className={goToMachinePoolTab ? 'pf-v5-u-mb-lg' : 'pf-v5-u-mt-lg'}
        isExpandable
        isInline
        role="alert"
        variant={AlertVariant.warning}
        title="Update available for Machine pools"
        data-testid="alert-warning"
        actionLinks={
          <>
            {pending && !goToMachinePoolTab ? (
              <Spinner size="sm" aria-label="Updating machine pools" />
            ) : null}
            {!pending && !goToMachinePoolTab ? (
              <AlertActionLink onClick={() => updateNodePools()} data-testid="btn-update-all">
                Update all Machine pools now
              </AlertActionLink>
            ) : null}
            {goToMachinePoolTab ? (
              <Link to={`/details/${clusterId}#machinePools`}>Go to Machine pools list</Link>
            ) : null}
          </>
        }
      >
        <p>
          You can update all worker nodes to the current control plane version (
          {semver.coerce(controlPlaneVersion)?.version}
          ), or use the CLI to update a specific version.{' '}
          <ExternalLink href={links.ROSA_UPGRADES}>Learn more about updates</ExternalLink>
        </p>
      </Alert>
    </>
  );
};

export default UpdateAllMachinePools;
