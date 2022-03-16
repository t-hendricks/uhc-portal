import React from 'react';
import InfoCircleIcon from '@patternfly/react-icons/dist/js/icons/info-circle-icon';
import links from '../../../../../../common/installLinks';
import ExternalLink from '../../../../../common/ExternalLink';

const isMachinePoolUsingSpotInstances = (machinePoolId, machinePoolsList) => {
  const selectedMachinePool = machinePoolsList.data.find(
    machinePool => (machinePool.id || machinePool.name) === machinePoolId,
  );
  return selectedMachinePool ? selectedMachinePool?.aws : false;
};

const SpotInstanceInfoAlert = () => (
  <>
    <InfoCircleIcon fill="var(--pf-global--info-color--100)" />
    {' '}
    This machine pool is using
    {' '}
    <ExternalLink href={links.AWS_SPOT_INSTANCES}>
      Spot instances
    </ExternalLink>
    {' '}
    for cost savings
  </>
);

export { SpotInstanceInfoAlert, isMachinePoolUsingSpotInstances };
