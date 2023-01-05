import max from 'lodash/max';
import { normalizedProducts } from '../../../../../../../common/subscriptionTypes';

const getMinNodesAllowed = ({
  isDefaultMachinePool,
  product,
  isBYOC,
  isMultiAz,
  autoScaleMinNodesValue = null,
}) => {
  let currMinNodes = parseInt(autoScaleMinNodesValue, 10) || 0;
  if (isMultiAz) {
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
    minNodesAllowed = 0;
  }
  return max([currMinNodes, minNodesAllowed]);
};

export const getNodesCount = (isBYOC, isMultiAz, asString) => {
  let computeNodes;
  if (isBYOC) {
    computeNodes = isMultiAz ? 3 : 2;
  } else {
    computeNodes = isMultiAz ? 9 : 4;
  }
  return asString ? `${computeNodes}` : computeNodes;
};

export const getMinReplicasCount = (isBYOC, isMultiAz, asString) => {
  let minReplicas;
  if (isMultiAz) {
    minReplicas = getNodesCount(isBYOC, isMultiAz) / 3;
  } else {
    minReplicas = getNodesCount(isBYOC, isMultiAz);
  }
  return asString ? `${minReplicas}` : minReplicas;
};

export default getMinNodesAllowed;
