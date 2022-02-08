import max from 'lodash/max';
import { normalizedProducts } from '../../../../../../../common/subscriptionTypes';

const getMinNodesAllowed = ({
  isDefaultMachinePool,
  product,
  isBYOC,
  isMultiAz,
  autoScaleMinNodesValue,
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

export default getMinNodesAllowed;
