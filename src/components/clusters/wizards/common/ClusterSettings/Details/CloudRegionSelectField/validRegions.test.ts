import { awsRegions } from '~/common/__tests__/regions.fixtures';
import type { CloudRegion } from '~/types/clusters_mgmt.v1';

import { checkRegion, defaultRegionID } from './validRegions';

const region = (id: string) => awsRegions.find((r) => r.id === id) as CloudRegion;

describe('checkRegion', () => {
  it('checks .enabled', () => {
    const context = { cloudProviderID: 'aws', isBYOC: false, isMultiAz: false };
    expect(checkRegion(region('disabled-2'), context)).toMatchObject({
      disableReason: 'This region is not supported',
      hide: true,
    });
  });

  it('checks .supports_multi_az', () => {
    const context = { cloudProviderID: 'aws', isBYOC: false };
    expect(checkRegion(region('single-az-3'), { ...context, isMultiAz: false })).toMatchObject({
      disableReason: undefined,
      hide: false,
    });
    expect(checkRegion(region('single-az-3'), { ...context, isMultiAz: true })).toMatchObject({
      disableReason: 'This region only supported for Single-zone, not Multi-zone',
      hide: false,
    });
  });

  it('checks .ccs_only', () => {
    const context = { cloudProviderID: 'aws', isMultiAz: false };
    expect(checkRegion(region('ccs-only-4'), { ...context, isBYOC: false })).toMatchObject({
      disableReason:
        'This region only supported on Customer cloud subscription, not Red Hat account',
      hide: true,
    });
    expect(checkRegion(region('ccs-only-4'), { ...context, isBYOC: true })).toMatchObject({
      disableReason: undefined,
      hide: false,
    });
  });

  it('checks .supports_hypershift', () => {
    const context = { cloudProviderID: 'aws', isBYOC: true, isMultiAz: false };
    expect(
      checkRegion(region('ccs-only-4'), { ...context, isHypershiftSelected: false }),
    ).toMatchObject({ disableReason: undefined, hide: false });
    expect(
      checkRegion(region('ccs-only-4'), { ...context, isHypershiftSelected: true }),
    ).toMatchObject({
      disableReason: 'This region is not supported with Hosted Control Plane, only Standalone',
      hide: true,
    });
    expect(
      checkRegion(region('hypershift-5'), { ...context, isHypershiftSelected: true }),
    ).toMatchObject({ disableReason: undefined, hide: false });
  });
});

describe('defaultRegionID', () => {
  it('chooses us-east-1 if possible', () => {
    const context = { cloudProviderID: 'aws', isBYOC: false, isMultiAz: false };
    const checkedRegions = awsRegions.map((r) => checkRegion(r, context));
    expect(awsRegions[0].id).not.toBe('us-east-1'); // It's not the first but it's preferred.
    expect(defaultRegionID(checkedRegions, 'aws')).toBe('us-east-1');
  });

  it('chooses first compatible', () => {
    const context = {
      cloudProviderID: 'aws',
      isBYOC: true,
      isMultiAz: false,
      isHypershiftSelected: true,
    };
    const checkedRegions = awsRegions.map((r) => checkRegion(r, context));
    expect(defaultRegionID(checkedRegions, 'aws')).toBe('hypershift-5');
  });
});
