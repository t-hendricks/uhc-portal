import max from 'lodash/max';
import { normalizedProducts } from '~/common/subscriptionTypes';
import { constants } from '~/components/clusters/common/CreateOSDFormConstants';

const getMinNodesAllowed = ({
  isDefaultMachinePool,
  product,
  isBYOC,
  isMultiAz,
  autoScaleMinNodesValue = null,
  defaultMinAllowed = 0,
  isHypershiftWizard = false,
}) => {
  let currMinNodes = parseInt(autoScaleMinNodesValue, 10) || 0;
  if (isMultiAz && !isHypershiftWizard) {
    currMinNodes *= 3;
  }
  let minNodesAllowed;
  if (isDefaultMachinePool) {
    if (isBYOC || product === normalizedProducts.ROSA) {
      minNodesAllowed = isMultiAz ? 3 : 2;
    } else {
      minNodesAllowed = isMultiAz ? 9 : 4;
    }
  } else {
    minNodesAllowed = defaultMinAllowed;
  }
  return max([currMinNodes, minNodesAllowed]);
};

export const getNodesCount = (isBYOC, isMultiAz, asString) => {
  // TODO: if this used for a ROSA wizard/cluster:
  // verify that this is returning correct results ...
  // it is possible to be both isMultiAZ and isHypershfit
  const powExponent = isBYOC ? 1 : 2;
  const computeNodes = (isMultiAz ? 3 : 2) ** powExponent;
  return asString ? `${computeNodes}` : computeNodes;
};

export const getMinReplicasCount = (isBYOC, isMultiAz, asString, isHypershiftSelected = false) => {
  const nodesCount = getNodesCount(isBYOC, isMultiAz);
  const minReplicas = isMultiAz && !isHypershiftSelected ? nodesCount / 3 : nodesCount;
  return asString ? `${minReplicas}` : minReplicas;
};

export const computeNodeHintText = (isHypershiftWizard, isAddEditHypershiftModal) => {
  switch (true) {
    case isHypershiftWizard:
      return constants.hcpComputeNodeCountHintWizard;
    case isAddEditHypershiftModal:
      return constants.hcpComputeNodeCountHint;
    default:
      return constants.computeNodeCountHint;
  }
};

export default getMinNodesAllowed;
