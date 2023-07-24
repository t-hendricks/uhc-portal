import React from 'react';
import { Alert, AlertActionLink, AlertVariant, Spinner } from '@patternfly/react-core';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import semver from 'semver';
import { GlobalState } from '~/redux/store';
import ExternalLink from '~/components/common/ExternalLink';
import { isHypershiftCluster } from '../../../clusterDetailsHelper';
import { getMachineOrNodePools } from '../MachinePoolsActions';
import { NodePool } from '~/types/clusters_mgmt.v1/models/NodePool';
import links from '~/common/installLinks.mjs';
import {
  updateAllMachinePools as updateAllPools,
  useControlPlaneUpToDate,
  controlPlaneVersionSelector,
  controlPlaneIdSelector,
  compareIsMachinePoolBehindControlPlane,
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

  const controlPlaneUpToDate = useControlPlaneUpToDate();

  const clusterId = useSelector(controlPlaneIdSelector);

  const controlPlaneVersion = useSelector(controlPlaneVersionSelector);
  const machinePools = useSelector((state: GlobalState) => state.machinePools?.getMachinePools);
  const isHypershift = useSelector((state: GlobalState) =>
    isHypershiftCluster(state.clusters.details.cluster),
  );

  if (!controlPlaneUpToDate) {
    return null;
  }

  const machinePoolsToUpdate = machinePools.data.filter((pool: NodePool) =>
    // @ts-ignore pool.version not picked up by running yarn gen-type
    compareIsMachinePoolBehindControlPlane(controlPlaneVersion, pool.version.id),
  );

  if (machinePoolsToUpdate.length === 0) {
    return null;
  }

  const updateNodePools = async () => {
    setPending(true);
    const errors = await updateAllPools(machinePoolsToUpdate, clusterId, controlPlaneVersion || '');
    setPending(false);
    setErrors(errors);
    dispatch(getMachineOrNodePools(clusterId, isHypershift));
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
