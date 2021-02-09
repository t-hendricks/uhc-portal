import { normalizedProducts } from '../../../../../../common/subscriptionTypes';
import { mockAddOns, mockClusterAddOns, mockClusterAddOnsParams } from './AddOns.fixtures';
import { quotaSummary } from '../../../../../subscriptions/__test__/Subscriptions.fixtures';
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

const { cluster } = fixtures.clusterDetails;

describe('isAvailable', () => {
  it('should determine that free add-on is available', () => {
    const available = isAvailable(mockAddOns.items[0], cluster, { fulfilled: true }, quotaSummary);
    expect(available).toBe(true);
  });

  it('should determine that add-on is not available', () => {
    const available = isAvailable(mockAddOns.items[2], cluster, { fulfilled: true }, quotaSummary);
    expect(available).toBe(false);
  });

  it('should determine that add-on is available', () => {
    const available = isAvailable(mockAddOns.items[3], cluster, { fulfilled: true }, quotaSummary);
    expect(available).toBe(true);
  });

  it('should determine that add-on is not available for non-OSD cluster', () => {
    const available = isAvailable(mockAddOns.items[0], {
      product: { id: normalizedProducts.RHMI },
    }, { fulfilled: true }, quotaSummary);
    expect(available).toBe(false);
  });

  it('should determine that add-on is available for OSD cluster', () => {
    const available = isAvailable(mockAddOns.items[0], {
      product: { id: normalizedProducts.OSD },
    }, { fulfilled: true }, quotaSummary);
    expect(available).toBe(true);
  });

  it('should determine that add-on is available for ROSA cluster', () => {
    const available = isAvailable(mockAddOns.items[0], {
      product: { id: normalizedProducts.ROSA },
    }, { fulfilled: true }, quotaSummary);
    expect(available).toBe(true);
  });
});

describe('isInstalled', () => {
  it('should determine that add-on is not installed', () => {
    const installed = isInstalled(mockAddOns.items[1], mockClusterAddOns);
    expect(installed).toBe(false);
  });

  it('should determine that add-on is installed', () => {
    const installed = isInstalled(mockAddOns.items[2], mockClusterAddOns);
    expect(installed).toBe(true);
  });
});

describe('hasQuota', () => {
  it('should determine that the org does not need quota for the add-on', () => {
    const quota = hasQuota(mockAddOns.items[0], cluster, { fulfilled: true }, quotaSummary);
    expect(quota).toBe(true);
  });

  it('should determine that the org does not have quota for the add-on', () => {
    const quota = hasQuota(mockAddOns.items[2], cluster, { fulfilled: true }, quotaSummary);
    expect(quota).toBe(false);
  });

  it('should determine that the org has quota for the add-on', () => {
    const quota = hasQuota(mockAddOns.items[3], cluster, { fulfilled: true }, quotaSummary);
    expect(quota).toBe(true);
  });

  it('should determine that the org does not need quota for the add-on on an OSD cluster', () => {
    const quota = hasQuota(mockAddOns.items[0], {
      product: { id: normalizedProducts.OSD },
    }, { fulfilled: true }, quotaSummary);
    expect(quota).toBe(true);
  });

  it('should determine that the org does not need quota for the add-on on a ROSA cluster', () => {
    const quota = hasQuota(mockAddOns.items[0], {
      product: { id: normalizedProducts.ROSA },
    }, { fulfilled: true }, quotaSummary);
    expect(quota).toBe(true);
  });
});

describe('availableAddOns', () => {
  it('should return an empty list', () => {
    const addOns = availableAddOns({ items: [] }, cluster, mockClusterAddOns, {
      fulfilled: true,
    }, quotaSummary);
    expect(addOns).toEqual([]);
  });

  it('should return a list of available add-ons', () => {
    const addOns = availableAddOns(mockAddOns, cluster, mockClusterAddOns, {
      fulfilled: true,
    }, quotaSummary);
    expect(addOns).toEqual([mockAddOns.items[0], mockAddOns.items[2], mockAddOns.items[3]]);
  });
});

describe('hasParameters', () => {
  it('should determine that the add-on has parameters', () => {
    const hasParams = hasParameters(mockAddOns.items[1]);
    expect(hasParams).toBe(true);
  });

  it('should determine that the add-on has no parameters', () => {
    const hasParams = hasParameters(mockAddOns.items[0]);
    expect(hasParams).toBe(false);
  });
});

describe('getParameter', () => {
  it('should return the existing parameter', () => {
    const param = getParameter(mockAddOns.items[1], 'cidr-range');
    expect(param).toEqual(mockAddOns.items[1].parameters.items[0]);
  });

  it('should return undefined for non existing parameter', () => {
    const param = getParameter(mockAddOns.items[1], 'foo');
    expect(param).toEqual(undefined);
  });

  it('should return undefined for addOn with no parameters', () => {
    const param = getParameter(mockAddOns.items[0], 'cidr-range');
    expect(param).toEqual(undefined);
  });
});

describe('parameterValuesForEditing', () => {
  it('should return an empty object for addOn with no parameters', () => {
    const param = parameterValuesForEditing(mockClusterAddOnsParams.items[0], mockAddOns.items[0]);
    expect(param).toEqual({ parameters: {} });
  });
  it('should return an empty object for addOn with parameters but no current values', () => {
    const param = parameterValuesForEditing(undefined, mockAddOns.items[1]);
    expect(param).toEqual({ parameters: {} });
  });
  it('should return existing values', () => {
    const param = parameterValuesForEditing(mockClusterAddOnsParams.items[1], mockAddOns.items[1]);
    expect(param).toEqual({ parameters: { 'cidr-range': '10.1.0.0/16' } });
  });
  it('should return only existing values for current addon parameters', () => {
    const param = parameterValuesForEditing(mockClusterAddOnsParams.items[2], mockAddOns.items[1]);
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
