// This is a helper function to sort a MachineType structure according to size and category.
import get from 'lodash/get';
import map from 'lodash/map';
import { parseValueWithUnit } from '../../../../../../../common/units';
import { machineCategories } from './MachineTypeSelection';

const categories = map(machineCategories, 'name');

function sortByMemory(a, b) {
  // sort by memory, ascending order
  const memoryBytesA = parseValueWithUnit(a.memory.value, a.memory.unit);
  const memoryBytesB = parseValueWithUnit(b.memory.value, b.memory.unit);
  return memoryBytesA - memoryBytesB;
}

function sortMachineTypesByCategories(a, b) {
  if (a.category === b.category) {
    // the categories are equal. Within the category, we need to sort by size.
    const memorySortResult = sortByMemory(a, b);
    if (memorySortResult === 0) {
      // sort by CPU if two machine types have the same amount of memory
      return a.cpu.value - b.cpu.value;
    }
    return memorySortResult;
  }
  return categories.indexOf(a.category) - categories.indexOf(b.category);
}

/**
 * mapping of sort function to cloud provider.
 * If we ever add new cloud providers that require custom sorting, they can be added here.
 */
const sortFuncs = {
  gcp: sortMachineTypesByCategories,
  aws: sortMachineTypesByCategories,
};

function sortMachineTypes(state, cloudProviderID) {
  const types = get(state.machineTypes.types, cloudProviderID, []);
  types.sort(sortFuncs[cloudProviderID]);
  return types;
}

export default sortMachineTypes;
