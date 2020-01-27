// This is a helper function to sort a MachineType structure according to size and category.
import get from 'lodash/get';
import { parseValueWithUnit } from '../../../../../common/units';

const AWS_GENERAL_PURPOSE_CATEGORY = 'm';
const AWS_MEMORY_CATEGORY = 'r';
const AWS_COMPUTE_CATEGORY = 'c';
const GCP_GENERAL_PURPOSE_CATEGORY = 'n';
const GCP_MEMORY_CATEGORY = 'm';
const GCP_COMPUTE_CATEGORY = 'c';


function sortByMemory(a, b) {
  // sort by memory, ascending order
  const memoryBytesA = parseValueWithUnit(a.memory.value, a.memory.unit);
  const memoryBytesB = parseValueWithUnit(b.memory.value, b.memory.unit);
  return memoryBytesA - memoryBytesB;
}

function sortMachineTypesByCategories(a, b, categories) {
  const categoryA = a.id.toLowerCase().charAt(0);
  const categoryB = b.id.toLowerCase().charAt(0);
  if (categoryA === categoryB) {
    // the categories are equal. Within the category, we need to sort by size.
    const memorySortResult = sortByMemory(a, b);
    if (memorySortResult === 0) {
      // sort by CPU if two machine types have the same amount of memory
      return a.cpu.value - b.cpu.value;
    }
    return memorySortResult;
  }
  return categories.indexOf(categoryA) - categories.indexOf(categoryB);
}

function sortGcpMachineTypes(a, b) {
  return sortMachineTypesByCategories(a, b, [GCP_GENERAL_PURPOSE_CATEGORY,
    GCP_MEMORY_CATEGORY, GCP_COMPUTE_CATEGORY]);
}

function sortAwsMachineTypes(a, b) {
  return sortMachineTypesByCategories(a, b, [AWS_GENERAL_PURPOSE_CATEGORY,
    AWS_MEMORY_CATEGORY, AWS_COMPUTE_CATEGORY]);
}

const sortFuncs = {
  gcp: sortGcpMachineTypes,
  aws: sortAwsMachineTypes,
};

function sortMachineTypes(cloudProviderID, machineTypes) {
  const types = get(machineTypes, cloudProviderID, []);
  types.sort(sortFuncs[cloudProviderID]);
  return types;
}

export default sortMachineTypes;
