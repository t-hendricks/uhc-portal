import max from 'lodash/max';
import { normalizedProducts } from '../../../../../../../common/subscriptionTypes';

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
  let computeNodes;
  if (isBYOC) {
    computeNodes = isMultiAz ? 3 : 2;
  } else {
    computeNodes = isMultiAz ? 9 : 4;
  }
  return asString ? `${computeNodes}` : computeNodes;
};

export const getMinReplicasCount = (isBYOC, isMultiAz, asString, isHypershiftSelected = false) => {
  let minReplicas;
  if (isMultiAz && !isHypershiftSelected) {
    minReplicas = getNodesCount(isBYOC, isMultiAz) / 3;
  } else {
    minReplicas = getNodesCount(isBYOC, isMultiAz);
  }
  return asString ? `${minReplicas}` : minReplicas;
};

export default getMinNodesAllowed;
