import { mockAddOns, mockClusterAddOns } from './AddOns.fixtures';
import { quotaSummary } from '../../../../../subscriptions/__test__/Subscriptions.fixtures';
import { clusterDetails } from '../../../__test__/ClusterDetails.fixtures';

import {
  isAvailable,
  isInstalled,
  hasQuota,
  availableAddOns,
} from '../AddOnsHelper';

const { cluster } = clusterDetails;

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
      product: { id: 'rhmi' },
    }, { fulfilled: true }, quotaSummary);
    expect(available).toBe(false);
  });

  it('should determine that add-on is available for OSD cluster', () => {
    const available = isAvailable(mockAddOns.items[0], {
      product: { id: 'osd' },
    }, { fulfilled: true }, quotaSummary);
    expect(available).toBe(true);
  });

  it('should determine that add-on is available for MOA cluster', () => {
    const available = isAvailable(mockAddOns.items[0], {
      product: { id: 'moa' },
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
      product: { id: 'osd' },
    }, { fulfilled: true }, quotaSummary);
    expect(quota).toBe(true);
  });

  it('should determine that the org does not need quota for the add-on on a MOA cluster', () => {
    const quota = hasQuota(mockAddOns.items[0], {
      product: { id: 'moa' },
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
