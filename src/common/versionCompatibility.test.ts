import { SupportedFeature } from '~/common/featureCompatibility';
import { CompatibilityOptions, getIncompatibleVersionReason } from '~/common/versionCompatibility';

const sgReasonDay1 = 'To use security groups, your cluster must be version 4.14.0 or newer.';
const sgReasonDay2 = 'To use security groups, your cluster must be version 4.11.0 or newer.';
const sgReasonDay2Hypershift =
  'To use security groups, your cluster must be version 4.15.0 or newer.';
const sharedVpcReason = 'To use shared VPCs, your cluster must be version 4.13.9 or newer.';

describe('versionCompatibility', () => {
  describe('Incompatible reason is given for', () => {
    it.each([
      [SupportedFeature.SECURITY_GROUPS, '4.10', { day1: true }, sgReasonDay1],
      [SupportedFeature.SECURITY_GROUPS, '4.10', { day1: true, isHypershift: true }, sgReasonDay1],
      [SupportedFeature.SECURITY_GROUPS, '4', { day2: true }, sgReasonDay2],
      [
        SupportedFeature.SECURITY_GROUPS,
        '4.12',
        { day2: true, isHypershift: true },
        sgReasonDay2Hypershift,
      ],
      [SupportedFeature.AWS_SHARED_VPC, '4.12.43', { day1: true }, sharedVpcReason],
      [
        SupportedFeature.AWS_SHARED_VPC,
        '4.12.43',
        { day1: true, isHypershift: true },
        sharedVpcReason,
      ],
      [SupportedFeature.AWS_SHARED_VPC, '4.12.43', { day2: true }, sharedVpcReason],
      [
        SupportedFeature.AWS_SHARED_VPC,
        '4.12.43',
        { day2: true, isHypershift: true },
        sharedVpcReason,
      ],
    ])(
      'feature "%s", version "%s" and %o',
      (
        feature: SupportedFeature,
        versionId: string,
        options: CompatibilityOptions,
        expectedReason: string,
      ) => {
        expect(getIncompatibleVersionReason(feature, versionId, options)).toEqual(expectedReason);
      },
    );
  });

  describe('No incompatible reason is given for', () => {
    it.each([
      [SupportedFeature.SECURITY_GROUPS, '4.14.4', { day1: true }, ''],
      [SupportedFeature.SECURITY_GROUPS, '4.14.4', { day1: true, isHypershift: true }, ''],
      [SupportedFeature.SECURITY_GROUPS, '4.11.0', { day2: true }, ''],
      [SupportedFeature.SECURITY_GROUPS, '4.15.0', { day2: true, isHypershift: true }, ''],
      [SupportedFeature.AWS_SHARED_VPC, '4.13.10', { day1: true }, ''],
      [SupportedFeature.AWS_SHARED_VPC, '4.13.10', { day1: true, isHypershift: true }, ''],
      [SupportedFeature.AWS_SHARED_VPC, '4.13.10', { day2: true }, ''],
      [SupportedFeature.AWS_SHARED_VPC, '4.13.10', { day2: true, isHypershift: true }, ''],
    ])(
      'feature "%s", version "%s" and %o',
      (
        feature: SupportedFeature,
        versionId: string,
        options: CompatibilityOptions,
        expectedReason: string,
      ) => {
        expect(getIncompatibleVersionReason(feature, versionId, options)).toEqual(expectedReason);
      },
    );
  });
});
