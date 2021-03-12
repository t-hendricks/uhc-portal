import { normalizedProducts } from '../../../../../../common/subscriptionTypes';
import {
  crcWorkspaces,
  managedIntegration,
  serviceMesh,
  dbaOperator,
  loggingOperator,
  mockAddOns,
  mockClusterAddOns,
  mockClusterAddOnsParams,
} from './AddOns.fixtures';
import {
  crcWorkspacesAddonQuota,
  loggingAddonQuota,
  dbaAddonQuota,
  addonsQuota,
} from '../../../../common/__test__/quota.fixtures';

import fixtures from '../../../__test__/ClusterDetails.fixtures';

import {
  isAvailable,
  isInstalled,
  hasQuota,
  availableAddOns,
  hasParameters,
  getParameter,
  parameterValuesForEditing,
} from '../AddOnsHelper';

const osdCluster = fixtures.clusterDetails.cluster;
const osdCCSCluster = {
  ...osdCluster,
  ccs: { enabled: true },
};
const rosaCluster = {
  ...osdCCSCluster,
  product: { id: normalizedProducts.ROSA },
  subscription: {
    ...osdCCSCluster.subscription,
    plan: { id: normalizedProducts.ROSA },
  },
};
const rhmiCluster = {
  ...osdCCSCluster,
  product: { id: normalizedProducts.RHMI },
  subscription: {
    ...osdCCSCluster.subscription,
    plan: { id: normalizedProducts.RHMI },
  },
};

const org = { fulfilled: true };

describe('isAvailable', () => {
  it('should determine that logging add-on is available on rhInfra', () => {
    const available = isAvailable(loggingOperator, osdCluster, org, loggingAddonQuota);
    expect(available).toBe(true);
  });

  it('should determine that logging add-on is available on CCS', () => {
    const available = isAvailable(loggingOperator, osdCCSCluster, org, loggingAddonQuota);
    expect(available).toBe(true);
  });

  it('should determine that free add-on is available', () => {
    const available = isAvailable(
      crcWorkspaces, osdCluster, org, crcWorkspacesAddonQuota,
    );
    expect(available).toBe(true);
  });

  it('should determine that add-on is not available', () => {
    const available = isAvailable(serviceMesh, osdCluster, org, dbaAddonQuota);
    expect(available).toBe(false);
  });

  it('should determine that add-on is available', () => {
    const available = isAvailable(dbaOperator, osdCluster, org, dbaAddonQuota);
    expect(available).toBe(true);
  });

  it('should determine that add-on is available for non-OSD cluster', () => {
    // addon-crw-operator has product 'any'
    let available = isAvailable(
      crcWorkspaces, rhmiCluster, org, crcWorkspacesAddonQuota,
    );
    expect(available).toBe(true);
    available = isAvailable(crcWorkspaces, rosaCluster, org, crcWorkspacesAddonQuota);
    expect(available).toBe(true);
    available = isAvailable(crcWorkspaces, osdCluster, org, crcWorkspacesAddonQuota);
    expect(available).toBe(true);
  });

  it('should determine that several add-ons are available', () => {
    expect(isAvailable(serviceMesh, osdCCSCluster, org, addonsQuota)).toBe(true);
    expect(isAvailable(crcWorkspaces, osdCCSCluster, org, addonsQuota)).toBe(true);
    expect(isAvailable(dbaOperator, osdCCSCluster, org, addonsQuota)).toBe(true);
    expect(isAvailable(loggingOperator, osdCCSCluster, org, addonsQuota)).toBe(true);
  });
});

describe('isInstalled', () => {
  it('should determine that add-on is not installed', () => {
    const installed = isInstalled(managedIntegration, mockClusterAddOns);
    expect(installed).toBe(false);
  });

  it('should determine that add-on is installed', () => {
    const installed = isInstalled(serviceMesh, mockClusterAddOns);
    expect(installed).toBe(true);
  });
});

describe('hasQuota', () => {
  it('should determine that the org does not have quota on rhInfra', () => {
    const quota = hasQuota(loggingOperator, osdCluster, org, loggingAddonQuota);
    expect(quota).toBe(false);
  });

  it('should determine that the org does not need quota on CCS', () => {
    const quota = hasQuota(loggingOperator, osdCCSCluster, org, loggingAddonQuota);
    expect(quota).toBe(true);
  });

  it('should determine that the org does not need quota for the add-on', () => {
    const quota = hasQuota(crcWorkspaces, osdCluster, org, crcWorkspacesAddonQuota);
    expect(quota).toBe(true);
  });

  it('should determine that the org does not have quota for different add-on', () => {
    const quota = hasQuota(serviceMesh, osdCluster, org, dbaAddonQuota);
    expect(quota).toBe(false);
  });

  it('should determine that the org has quota for the add-on', () => {
    const quota = hasQuota(dbaOperator, osdCluster, org, dbaAddonQuota);
    expect(quota).toBe(true);
  });

  it('should determine that the org does not need quota for the add-on on an OSD cluster', () => {
    const quota = hasQuota(crcWorkspaces, osdCluster, org, crcWorkspacesAddonQuota);
    expect(quota).toBe(true);
  });

  it('should determine that the org does not need quota for the add-on on a ROSA cluster', () => {
    const quota = hasQuota(crcWorkspaces, rosaCluster, org, crcWorkspacesAddonQuota);
    expect(quota).toBe(true);
  });

  it('should determine that the org has quota for several add-ons', () => {
    expect(hasQuota(serviceMesh, osdCCSCluster, org, addonsQuota)).toBe(true);
    expect(hasQuota(crcWorkspaces, osdCCSCluster, org, addonsQuota)).toBe(true);
    expect(hasQuota(dbaOperator, osdCCSCluster, org, addonsQuota)).toBe(true);
    expect(hasQuota(loggingOperator, osdCCSCluster, org, addonsQuota)).toBe(true);
  });
});

describe('availableAddOns', () => {
  it('should return an empty list', () => {
    const addOns = availableAddOns({ items: [] }, osdCluster, mockClusterAddOns, {
      fulfilled: true,
    }, addonsQuota);
    expect(addOns).toEqual([]);
  });

  it('should return a list of available add-ons', () => {
    const addOns = availableAddOns(mockAddOns, osdCluster, mockClusterAddOns, {
      fulfilled: true,
    }, addonsQuota);
    expect(addOns).toEqual([crcWorkspaces, serviceMesh, dbaOperator, loggingOperator]);
  });
});

describe('hasParameters', () => {
  it('should determine that the add-on has parameters', () => {
    const hasParams = hasParameters(managedIntegration);
    expect(hasParams).toBe(true);
  });

  it('should determine that the add-on has no parameters', () => {
    const hasParams = hasParameters(crcWorkspaces);
    expect(hasParams).toBe(false);
  });
});

describe('getParameter', () => {
  it('should return the existing parameter', () => {
    const param = getParameter(managedIntegration, 'cidr-range');
    expect(param).toEqual(managedIntegration.parameters.items[0]);
  });

  it('should return undefined for non existing parameter', () => {
    const param = getParameter(managedIntegration, 'foo');
    expect(param).toEqual(undefined);
  });

  it('should return undefined for addOn with no parameters', () => {
    const param = getParameter(crcWorkspaces, 'cidr-range');
    expect(param).toEqual(undefined);
  });
});

describe('parameterValuesForEditing', () => {
  it('should return an empty object for addOn with no parameters', () => {
    const param = parameterValuesForEditing(mockClusterAddOnsParams.items[0], crcWorkspaces);
    expect(param).toEqual({ parameters: {} });
  });
  it('should return an empty object for addOn with parameters but no current values', () => {
    const param = parameterValuesForEditing(undefined, managedIntegration);
    expect(param).toEqual({ parameters: {} });
  });
  it('should return existing values', () => {
    const param = parameterValuesForEditing(mockClusterAddOnsParams.items[1], managedIntegration);
    expect(param).toEqual({ parameters: { 'cidr-range': '10.1.0.0/16' } });
  });
  it('should return only existing values for current addon parameters', () => {
    const param = parameterValuesForEditing(mockClusterAddOnsParams.items[2], managedIntegration);
    expect(param).toEqual({ parameters: { 'cidr-range': '10.1.0.0/16' } });
  });
  it('should return false for boolean addon param with no installation param value', () => {
    const mockAddOnsParams = { parameters: { items: [{ id: 'my-bool', value_type: 'boolean' }] } };
    const mockAddOnsInstallParams = {};
    const param = parameterValuesForEditing(mockAddOnsInstallParams, mockAddOnsParams);
    expect(param).toEqual({ parameters: { 'my-bool': false } });
  });
  it('should return true for boolean addon param with installation param value of "true"', () => {
    const mockAddOnsParams = { parameters: { items: [{ id: 'my-bool', value_type: 'boolean' }] } };
    const mockAddOnsInstallParams = { parameters: { items: [{ id: 'my-bool', value: 'true' }] } };
    const param = parameterValuesForEditing(mockAddOnsInstallParams, mockAddOnsParams);
    expect(param).toEqual({ parameters: { 'my-bool': true } });
  });
  it('should return false for boolean addon param with installation param value of "false"', () => {
    const mockAddOnsParams = { parameters: { items: [{ id: 'my-bool', value_type: 'boolean' }] } };
    const mockAddOnsInstallParams = { parameters: { items: [{ id: 'my-bool', value: 'false' }] } };
    const param = parameterValuesForEditing(mockAddOnsInstallParams, mockAddOnsParams);
    expect(param).toEqual({ parameters: { 'my-bool': false } });
  });
});
