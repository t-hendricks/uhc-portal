import { normalizedProducts } from '../../../../../../../common/subscriptionTypes';

const getMinNodesAllowed = ({
  isDefaultMachinePool, product, isBYOC, isMultiAz,
}) => {
  let minNodesAllowed = 0;
  if (isDefaultMachinePool) {
    if (isBYOC || product === normalizedProducts.ROSA) {
      minNodesAllowed = isMultiAz ? 3 : 2;
    } else {
      minNodesAllowed = isMultiAz ? 9 : 4;
    }
  } else {
    minNodesAllowed = isMultiAz ? 3 : 1;
  }
  return minNodesAllowed;
};

export default getMinNodesAllowed;
