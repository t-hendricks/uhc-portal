import { Cluster } from '~/types/clusters_mgmt.v1';
import { normalizedProducts } from '~/common/subscriptionTypes';

import {
  isCompatibleFeature,
  CompatibilityOptions,
  SupportedFeatures,
} from './featureCompatibility';

const anyOptions = {};

describe('isCompatibleFeature', () => {
  describe('Security groups', () => {
    const checkCompatibility = (testCluster: Partial<Cluster>, options: CompatibilityOptions) =>
      isCompatibleFeature(SupportedFeatures.SECURITY_GROUPS, testCluster, options);
    describe('are incompatible for', () => {
      it.each([
        ['Hypershift', { hypershift: { enabled: true } }, {}],
        [
          'ROSA GCP + BYOVPC',
          {
            product: { id: normalizedProducts.ROSA },
            cloud_provider: { id: 'gcp' },
            gcp_network: { vpc_name: 'gcp-vpc' },
          },
          anyOptions,
        ],
        [
          'ROSA GCP + non-BYOVPC',
          {
            product: { id: normalizedProducts.ROSA },
            cloud_provider: { id: 'gcp' },
            gcp_network: undefined,
          },
          anyOptions,
        ],
        [
          'ROSA AWS + non-BYOVPC',
          {
            product: { id: normalizedProducts.ROSA },
            cloud_provider: { id: 'aws' },
            aws: { subnet_ids: undefined },
          },
          anyOptions,
        ],
        [
          'Day2 + ROSA AWS + BYOVPC + non-STS',
          {
            product: { id: normalizedProducts.ROSA },
            cloud_provider: { id: 'aws' },
            aws: {
              subnet_ids: ['subnet-private-id'],
              sts: undefined,
            },
          },
          { day2: true },
        ],
        [
          'Day2 + OSD AWS + BYOVPC + non-STS',
          {
            product: { id: normalizedProducts.OSD },
            cloud_provider: { id: 'aws' },
            aws: {
              subnet_ids: ['subnet-private-id'],
              sts: undefined,
            },
          },
          { day2: true },
        ],
      ])(
        '"%s" clusters',
        (
          _clusterDesc: string,
          clusterSettings: Partial<Cluster>,
          options: CompatibilityOptions,
        ) => {
          expect(checkCompatibility(clusterSettings, options)).toBeFalsy();
        },
      );
    });

    describe('are compatible for', () => {
      it.each([
        [
          'Day2 ROSA AWS + BYOVPC + STS',
          {
            product: { id: normalizedProducts.ROSA },
            cloud_provider: { id: 'aws' },
            aws: {
              subnet_ids: ['subnet-private-id'],
              sts: { role_arn: 'role-arn' },
            },
          },
          { day2: true },
        ],
        [
          'Day2 OSD AWS + BYOVPC + STS',
          {
            product: { id: normalizedProducts.OSD },
            cloud_provider: { id: 'aws' },
            aws: {
              subnet_ids: ['subnet-private-id'],
              sts: { role_arn: 'role-arn' },
            },
          },
          { day2: true },
        ],
      ])(
        '"%s" clusters',
        (
          _clusterDesc: string,
          clusterSettings: Partial<Cluster>,
          options: CompatibilityOptions,
        ) => {
          expect(checkCompatibility(clusterSettings, options)).toBeTruthy();
        },
      );
    });
  });
});
