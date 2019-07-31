// This is a helper function to sort a MachineType structure according to size and category.
import { parseValueWithUnit } from '../../../../../common/units';

function sortByMemory(a, b) {
  // sort by memory, ascending order
  const memoryBytesA = parseValueWithUnit(a.memory.value, a.memory.unit);
  const memoryBytesB = parseValueWithUnit(b.memory.value, b.memory.unit);
  if (memoryBytesA > memoryBytesB) {
    return 1;
  }
  if (memoryBytesB < memoryBytesA) {
    return -1;
  }
  return 0;
}

function sortMachineTypes(a, b) {
  // Sort by category, so the resulting order is m (general), r (memory), c (compute)
  const categoryA = a.id.toLowerCase().charAt(0);
  const categoryB = b.id.toLowerCase().charAt(0);
  if (categoryA === categoryB) {
    // the categories are equal. Within the category, we need to sort by size.
    // memory is enough for now.
    return sortByMemory(a, b);
  }
  if (categoryA === 'm') {
    return -1;
  }
  if (categoryB === 'm') {
    return 1;
  }
  if (categoryA === 'r' && categoryB === 'c') {
    return -1;
  }
  if (categoryA === 'c' && categoryB === 'r') {
    return 1;
  }
  return 0;
}


export default sortMachineTypes;
