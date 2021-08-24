import getMinNodesAllowed from '../AutoScaleHelper';
import { normalizedProducts } from '../../../../../../../../common/subscriptionTypes';

test('Autoscaling min nodes allowed', () => {
  const ccsMultiAZ = {
    isDefaultMachinePool: true, product: normalizedProducts.OSD, isBYOC: true, isMultiAz: true,
  };
  expect(getMinNodesAllowed(ccsMultiAZ)).toBe(3);
  const ccsSingleAZ = {
    isDefaultMachinePool: true, product: normalizedProducts.OSD, isBYOC: true, isMultiAz: false,
  };
  expect(getMinNodesAllowed(ccsSingleAZ)).toBe(2);

  const rosaMultiAZ = {
    isDefaultMachinePool: true, product: normalizedProducts.ROSA, isBYOC: false, isMultiAz: true,
  };
  expect(getMinNodesAllowed(rosaMultiAZ)).toBe(3);
  const rosaSingleAZ = {
    isDefaultMachinePool: true, product: normalizedProducts.ROSA, isBYOC: false, isMultiAz: false,
  };
  expect(getMinNodesAllowed(rosaSingleAZ)).toBe(2);

  const osdMultiAZ = {
    isDefaultMachinePool: true, product: normalizedProducts.OSD, isBYOC: false, isMultiAz: true,
  };
  expect(getMinNodesAllowed(osdMultiAZ)).toBe(9);
  const osdSingleAZ = {
    isDefaultMachinePool: true, product: normalizedProducts.OSD, isBYOC: false, isMultiAz: false,
  };
  expect(getMinNodesAllowed(osdSingleAZ)).toBe(4);

  const additionalMachinePoolMultiAZ = {
    isDefaultMachinePool: false, product: normalizedProducts.OSD, isBYOC: false, isMultiAz: true,
  };
  expect(getMinNodesAllowed(additionalMachinePoolMultiAZ)).toBe(0);
  const additionalMachinePoolSingleAZ = {
    isDefaultMachinePool: false, product: normalizedProducts.OSD, isBYOC: false, isMultiAz: false,
  };
  // Additional cases for when clusters already have autoscaling enabled, and have a min node count
  expect(getMinNodesAllowed(additionalMachinePoolSingleAZ)).toBe(0);
  const osdSingleAZAutoscaleEnabled = {
    isDefaultMachinePool: true,
    product: normalizedProducts.OSD,
    isBYOC: false,
    isMultiAz: false,
    autoScaleMinNodesValue: 8,
  };
  expect(getMinNodesAllowed(osdSingleAZAutoscaleEnabled)).toBe(8);
  const osdSMultiAZAutoscaleEnabled = {
    isDefaultMachinePool: true,
    product: normalizedProducts.OSD,
    isBYOC: false,
    isMultiAz: true,
    autoScaleMinNodesValue: 5,
  };
  expect(getMinNodesAllowed(osdSMultiAZAutoscaleEnabled)).toBe(15);
});
