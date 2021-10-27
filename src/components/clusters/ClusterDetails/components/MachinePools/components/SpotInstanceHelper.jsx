import React from 'react';
import InfoCircleIcon from '@patternfly/react-icons/dist/js/icons/info-circle-icon';
import ExternalLink from '../../../../../common/ExternalLink';

const spotInstanceDocUrl = 'https://docs.openshift.com/container-platform/4.8/machine_management/creating_machinesets/creating-machineset-aws.html#machineset-non-guaranteed-instance_creating-machineset-aws';

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
    <ExternalLink href={spotInstanceDocUrl}>
      Spot instances
    </ExternalLink>
    {' '}
    for cost savings
  </>
);

export { SpotInstanceInfoAlert, isMachinePoolUsingSpotInstances, spotInstanceDocUrl };
