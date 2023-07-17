import React from 'react';
import { Alert, AlertActionLink, AlertVariant, Spinner } from '@patternfly/react-core';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import semver from 'semver';
import { GlobalState } from '~/redux/store';
import clusterService from '~/services/clusterService';
import ExternalLink from '~/components/common/ExternalLink';
import { NodePool } from '~/types/clusters_mgmt.v1/models/NodePool';
import links from '~/common/installLinks.mjs';
import {
  hasAvailableUpdatesSelector,
  updateStartedSelector,
} from '~/components/clusters/common/Upgrades/upgradeHelpers';
import { isHypershiftCluster } from '../../../clusterDetailsHelper';
import { getMachineOrNodePools } from '../MachinePoolsActions';

const updateAllMachinePools = async (
  machinePools: NodePool[],
  clusterId: string,
  toBeVersion: string,
) => {
  const tempErrors: string[] = [];

  const promisesArray = machinePools.map((pool: NodePool) =>
    // @ts-ignore cluster id is incorrectly identified as optional and changes are not picked up by running yarn gen-types
    clusterService.patchNodePool(clusterId, pool.id, {
      version: { id: toBeVersion },
    }),
  );

  // @ts-ignore  error due to using an older compiler
  const results = await Promise.allSettled(promisesArray);

  interface PromiseFulfilledResult<T> {
    status: 'fulfilled';
    value: T;
  }
  interface PromiseRejectedResult {
    status: 'rejected';
    reason: any;
  }

  type PromiseSettledResult<T> = PromiseFulfilledResult<T> | PromiseRejectedResult;

  results.forEach((result: PromiseSettledResult<string>) => {
    if (result.status === 'rejected') {
      tempErrors.push(
        `${result.reason.response.data.code} - ${result.reason.response.data.reason}`,
      );
    }
  });
  return tempErrors;
};

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
  const clusterId = useSelector((state: GlobalState) => state.clusters.details.cluster.id) || '';
  const availableControlPlaneUpgrades = useSelector(hasAvailableUpdatesSelector);

  const controlPlaneUpgradeStarted = useSelector(updateStartedSelector);

  const controlPlaneVersion = useSelector(
    (state: GlobalState) => state.clusters.details.cluster?.version?.id,
  );
  const machinePools = useSelector((state: GlobalState) => state.machinePools?.getMachinePools);
  const isHypershift = useSelector((state: GlobalState) =>
    isHypershiftCluster(state.clusters.details.cluster),
  );

  if (
    availableControlPlaneUpgrades ||
    controlPlaneUpgradeStarted ||
    !machinePools.data ||
    !machinePools.fulfilled ||
    machinePools.error ||
    !controlPlaneVersion ||
    !isHypershift
  ) {
    return null;
  }

  const machinePoolsToUpdate = machinePools.data.filter((pool: NodePool) =>
    // @ts-ignore  Error due to an issue with semver - and pool.version not picked up by running yarn gen-types
    semver.gt(semver.coerce(controlPlaneVersion), semver.coerce(pool.version.id)),
  );

  if (machinePoolsToUpdate.length === 0) {
    return null;
  }

  const updateNodePools = async () => {
    setPending(true);
    const errors = await updateAllMachinePools(
      machinePoolsToUpdate,
      clusterId,
      controlPlaneVersion,
    );
    setPending(false);
    setErrors(errors);
    dispatch(getMachineOrNodePools(clusterId, isHypershift) as any);
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
          className="pf-u-mt-md"
        >
          {errors.map((error) => (
            <p>{error}</p>
          ))}
        </Alert>
      ) : null}
      <Alert
        className={goToMachinePoolTab ? 'pf-u-mb-lg' : 'pf-u-mt-lg'}
        isExpandable
        isInline
        role="alert"
        variant={AlertVariant.warning}
        title="Update available for Machine pools"
        actionLinks={
          <>
            {pending && !goToMachinePoolTab ? (
              <Spinner size="sm" aria-label="Updating machine pools" />
            ) : null}
            {!pending && !goToMachinePoolTab ? (
              <AlertActionLink onClick={() => updateNodePools()}>
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
