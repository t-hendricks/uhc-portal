import { normalizedProducts } from '~/common/subscriptionTypes';
import { Cluster } from '~/types/clusters_mgmt.v1';

import { isCompatibleFeature, SupportedFeature } from './featureCompatibility';

describe('isCompatibleFeature', () => {
  describe('Security groups', () => {
    const checkCompatibility = (testCluster: Partial<Cluster>) =>
      isCompatibleFeature(SupportedFeature.SECURITY_GROUPS, testCluster);
    describe('are incompatible for', () => {
      it.each([
        ['Hypershift enabled', { hypershift: { enabled: true } }],
        ['Hypershift not enabled', { hypershift: { enabled: false } }],
        [
          'ROSA GCP + BYOVPC',
          {
            product: { id: normalizedProducts.ROSA },
            cloud_provider: { id: 'gcp' },
            gcp_network: { vpc_name: 'gcp-vpc' },
          },
        ],
        [
          'ROSA GCP + non-BYOVPC',
          {
            product: { id: normalizedProducts.ROSA },
            cloud_provider: { id: 'gcp' },
            gcp_network: undefined,
          },
        ],
        [
          'ROSA AWS + non-BYOVPC',
          {
            product: { id: normalizedProducts.ROSA },
            cloud_provider: { id: 'aws' },
            aws: { subnet_ids: undefined },
          },
        ],
      ])('"%s" clusters', (_clusterDesc: string, clusterSettings: Partial<Cluster>) => {
        expect(checkCompatibility(clusterSettings)).toBeFalsy();
      });
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
        ],
        [
          'Day1 setup',
          {
            product: { id: normalizedProducts.ROSA },
            cloud_provider: { id: 'aws' },
            aws: {
              subnet_ids: ['subnet-private-id'],
              sts: { role_arn: 'role-arn' },
            },
          },
        ],
      ])('"%s" clusters', (_clusterDesc: string, clusterSettings: Partial<Cluster>) => {
        expect(checkCompatibility(clusterSettings)).toBeTruthy();
      });
    });
  });
});
