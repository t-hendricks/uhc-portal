import { ClusterFromSubscription } from '~/types/types';
import { Cluster, ClusterState } from '~/types/clusters_mgmt.v1';
import { normalizedProducts, subscriptionStatuses } from '~/common/subscriptionTypes';
import {
  defaultClusterFromSubscription,
  defaultMetric,
  defaultSubscription,
} from './__test__/clusterStates.fixtures';
import clusterStates, {
  getClusterStateAndDescription,
  getInflightChecks,
  isClusterUpgrading,
  isHibernating,
  isHypershiftCluster,
  isOSD,
  isOffline,
  isROSA,
  isWaitingForOIDCProviderOrOperatorRolesMode,
  isWaitingHypershiftCluster,
  isWaitingROSAManualMode,
  isCCS,
  isAWS,
  isAWSPrivateCluster,
} from './clusterStates';

describe('getClusterStateAndDescription', () => {
  it('should not handle AssistedInstall states', () => {
    const cluster: ClusterFromSubscription = {
      ...defaultClusterFromSubscription,
      subscription: {
        ...defaultSubscription,
        plan: {
          id: normalizedProducts.OCP_Assisted_Install,
          type: 'OCP',
        },
        status: subscriptionStatuses.DISCONNECTED,
      },
    };
    const result = getClusterStateAndDescription(cluster);
    expect(result.description).toEqual('Disconnected');
  });

  it('should show OCP updating', () => {
    const cluster: ClusterFromSubscription = {
      ...defaultClusterFromSubscription,
      metrics: {
        ...defaultMetric,
        upgrade: {
          state: 'running',
        },
      },
    };

    const result = getClusterStateAndDescription(cluster);
    expect(result.description).toEqual('Updating');
  });

  it.each([
    [{ subStatus: subscriptionStatuses.ACTIVE }, 'Ready'],
    [{ subStatus: subscriptionStatuses.STALE }, 'Stale'],
    [{ subStatus: subscriptionStatuses.ARCHIVED }, 'Archived'],
    [{ subStatus: subscriptionStatuses.DEPROVISIONED }, 'Deleted'],
    [{ subStatus: subscriptionStatuses.DISCONNECTED }, 'Disconnected'],
    [{ subStatus: subscriptionStatuses.STALE }, 'Stale'],
    [{ state: clusterStates.WAITING }, 'Waiting'],
    [{ state: clusterStates.INSTALLING }, 'Installing'],
    [{ state: 'validating' }, 'Installing'],
    [{ state: clusterStates.VALIDATING }, 'Installing'],
    [{ state: clusterStates.PENDING }, 'Installing'],
    [{ state: clusterStates.READY }, 'Ready'],
    [{ state: clusterStates.UNINSTALLING }, 'Uninstalling'],
    [{ state: clusterStates.RESUMING }, 'Resuming'],
    [{ state: clusterStates.HIBERNATING }, 'Hibernating'],
    [{ state: clusterStates.ERROR }, 'Error'],
    [{ state: clusterStates.POWERING_DOWN }, 'Powering down'],
    [{}, ''],
    [{ metricsState: 'running' }, 'Updating'],
  ])(
    'should show descriptions derived from %p expects to be %p',
    (
      props: { subStatus?: string; state?: clusterStates | string; metricsState?: string },
      expectedDescription: string,
    ) => {
      const cluster: ClusterFromSubscription = {
        ...defaultClusterFromSubscription,
        subscription: {
          ...defaultSubscription,
          status: props.subStatus,
        },
        metrics: {
          ...defaultMetric,
          upgrade: {
            state: props.metricsState,
          },
        },
        state: props.state,
      };
      const result = getClusterStateAndDescription(cluster);
      expect(result.description).toEqual(expectedDescription);
    },
  );

  describe('isWaitingROSAManualMode()', () => {
    const rosaManualCluster: ClusterFromSubscription = {
      ...defaultClusterFromSubscription,
      state: 'waiting',
      hypershift: { enabled: false },
      product: { id: 'ROSA' },
      aws: { sts: { auto_mode: false, oidc_config: {} } },
    };

    it.each([
      ['when is rosa and has a missing oidc config', true, rosaManualCluster],
      ['when state is not in waiting', false, { ...rosaManualCluster, state: 'ready' }],
      [
        'when is hypershift cluster',
        false,
        { ...rosaManualCluster, hypershift: { enabled: true } },
      ],
      ['when is not a ROSA cluster', false, { ...rosaManualCluster, product: { id: 'OSD' } }],
      [
        'when it is sts auto mode',
        false,
        { ...rosaManualCluster, aws: { sts: { auto_mode: true } } },
      ],
      [
        'when there is a oidc config',
        false,
        {
          ...rosaManualCluster,
          aws: { sts: { auto_mode: false, oidc_config: { id: 'my-oidc-id' } } },
        },
      ],
    ])(
      '%p it returns %p',
      (description: string, expectedResult: boolean, cluster: ClusterFromSubscription) => {
        expect(isWaitingROSAManualMode(cluster)).toBe(expectedResult);
      },
    );
  });

  describe('isHypershiftCluster', () => {
    describe('ClusterFromSubscription', () => {
      it.each([
        [normalizedProducts.ROSA_HyperShift, true, true],
        [normalizedProducts.ROSA_HyperShift, false, true],
        [normalizedProducts.ANY, true, true],
        [normalizedProducts.ANY, false, false],
      ])(
        'PlanId: %p, Hypersift Enabled: %p. It returns %p',
        (planId: string, hypershiftEnabled: boolean, expectedResult: boolean) => {
          const cluster: ClusterFromSubscription = {
            ...defaultClusterFromSubscription,
            subscription: {
              ...defaultSubscription,
              plan: {
                id: planId,
              },
            },
            hypershift: {
              enabled: hypershiftEnabled,
            },
          };
          expect(isHypershiftCluster(cluster)).toBe(expectedResult);
        },
      );
      it('undefined cluster. It returns false', () => {
        expect(isHypershiftCluster()).toBe(false);
      });
    });
    describe('Cluster', () => {
      it.each([
        [true, true],
        [false, false],
      ])(
        'Hypersift Enabled: %p. It returns %p',
        (hypershiftEnabled: boolean, expectedResult: boolean) => {
          const cluster: Cluster = {
            subscription: {},
            hypershift: {
              enabled: hypershiftEnabled,
            },
          };
          expect(isHypershiftCluster(cluster)).toBe(expectedResult);
        },
      );
    });
  });

  describe('isROSA', () => {
    it.each([
      [normalizedProducts.ROSA, true],
      [normalizedProducts.ROSA_HyperShift, false],
      [normalizedProducts.RHOSAK, false],
      [normalizedProducts.RHOSAK, false],
    ])('productId: %p. It returns %p', (productId: string, expectedResult: boolean) => {
      const cluster: ClusterFromSubscription = {
        ...defaultClusterFromSubscription,
        product: {
          id: productId,
        },
      };
      expect(isROSA(cluster)).toBe(expectedResult);
    });

    it('cluster undefined', () => {
      expect(isROSA(undefined)).toBe(false);
    });
  });

  describe('isWaitingForOIDCProviderOrOperatorRolesMode', () => {
    it.each([
      [ClusterState.WAITING, 'whatever', true],
      [ClusterState.WAITING, undefined, false],
      [ClusterState.HIBERNATING, 'whatever', false],
    ])(
      'state: %p. It returns %p',
      (state: ClusterState, awsStsConfigId: string | undefined, expectedResult: boolean) => {
        const cluster: ClusterFromSubscription = {
          ...defaultClusterFromSubscription,
          product: {
            id: normalizedProducts.ROSA,
          },
          state,
          aws: {
            sts: {
              oidc_config: { id: awsStsConfigId },
            },
          },
        };
        expect(isWaitingForOIDCProviderOrOperatorRolesMode(cluster)).toBe(expectedResult);
      },
    );
  });

  describe('isWaitingHypershiftCluster', () => {
    it.each([
      [ClusterState.WAITING, true],
      [ClusterState.HIBERNATING, false],
    ])('state: %p. It returns %p', (state: ClusterState, expectedResult: boolean) => {
      const cluster: ClusterFromSubscription = {
        ...defaultClusterFromSubscription,
        subscription: {
          ...defaultSubscription,
          plan: {
            id: normalizedProducts.ROSA_HyperShift,
          },
        },
        hypershift: {
          enabled: true,
        },
        state,
      };
      expect(isWaitingHypershiftCluster(cluster)).toBe(expectedResult);
    });
  });

  describe('isOSD', () => {
    it.each([
      [normalizedProducts.OSD, true],
      [normalizedProducts.OSDTrial, true],
      [normalizedProducts.ANY, false],
    ])('productId: %p. It returns %p', (productId: string, expectedResult: boolean) => {
      const cluster: ClusterFromSubscription = {
        ...defaultClusterFromSubscription,
        product: {
          id: productId,
        },
      };
      expect(isOSD(cluster)).toBe(expectedResult);
    });
  });

  describe('isCCS', () => {
    it.each([
      [true, true],
      [false, false],
    ])('ccs enabled: %p. It returns %p', (ccsEnabled: boolean, expectedResult: boolean) => {
      const cluster: ClusterFromSubscription = {
        ...defaultClusterFromSubscription,
        ccs: {
          enabled: ccsEnabled,
        },
      };
      expect(isCCS(cluster)).toBe(expectedResult);
    });
  });

  describe('isAWSPrivateCluster', () => {
    it.each([
      [true, true],
      [false, false],
    ])(
      'private_link enabled: %p. It returns %p',
      (privateLinkEnabled: boolean, expectedResult: boolean) => {
        const cluster: ClusterFromSubscription = {
          ...defaultClusterFromSubscription,
          aws: {
            private_link: privateLinkEnabled,
          },
          ccs: {
            enabled: true,
          },
        };
        expect(isAWSPrivateCluster(cluster)).toBe(expectedResult);
      },
    );
  });

  describe('isAWS', () => {
    it.each([
      ['aws', true],
      ['gcp', false],
    ])('cloud provider: %p. It returns %p', (cloudProvider: string, expectedResult: boolean) => {
      const cluster: ClusterFromSubscription = {
        ...defaultClusterFromSubscription,
        subscription: {
          managed: true,
          cloud_provider_id: cloudProvider,
        },
      };
      expect(isAWS(cluster)).toBe(expectedResult);
    });
  });

  describe('isHibernating', () => {
    it.each([
      [ClusterState.HIBERNATING, true],
      [ClusterState.POWERING_DOWN, true],
      [ClusterState.RESUMING, true],
      ['resuming', true],
      [ClusterState.READY, false],
      [ClusterState.READY, false],
      ['ready', false],
      [undefined, false],
    ])(
      'state: %p. It returns %p',
      (state: ClusterState | string | undefined, expectedResult: boolean) => {
        const cluster: ClusterFromSubscription = {
          ...defaultClusterFromSubscription,
          state,
        };
        expect(isHibernating(cluster)).toBe(expectedResult);
      },
    );
  });

  describe('isOffline', () => {
    it.each([
      [ClusterState.HIBERNATING, true],
      [ClusterState.POWERING_DOWN, true],
      [ClusterState.RESUMING, true],
      [ClusterState.UNINSTALLING, true],
      [ClusterState.READY, false],
    ])('state: %p. It returns %p', (state: ClusterState, expectedResult: boolean) => {
      const cluster: ClusterFromSubscription = {
        ...defaultClusterFromSubscription,
        state,
      };
      expect(isOffline(cluster)).toBe(expectedResult);
    });
  });

  describe('is cluster upgrading', () => {
    it('it is running', () => {
      // Arrange
      const cluster: ClusterFromSubscription = {
        ...defaultClusterFromSubscription,
        metrics: {
          ...defaultMetric,
          upgrade: {
            state: 'running',
          },
        },
      };

      // Act
      const isUpgrading = isClusterUpgrading(cluster);

      // Assert
      expect(isUpgrading).toBe(true);
    });

    it('it is not running', () => {
      // Arrange
      const cluster: ClusterFromSubscription = {
        ...defaultClusterFromSubscription,
        metrics: {
          ...defaultMetric,
          upgrade: {
            state: 'anything else',
          },
        },
      };

      // Act
      const isUpgrading = isClusterUpgrading(cluster);

      // Assert
      expect(isUpgrading).toBe(false);
    });

    it('cluster undefined', () => {
      // Act
      const isUpgrading = isClusterUpgrading();

      // Assert
      expect(isUpgrading).toBe(false);
    });
  });

  describe('getInflightChecks', () => {
    it('it is array', () => {
      // Arrange
      const cluster: ClusterFromSubscription = {
        ...defaultClusterFromSubscription,
        inflight_checks: [{ id: 'A' }, { id: 'B' }, { id: 'C' }],
      };

      // Act
      const inflightChecks = getInflightChecks(cluster);

      // Assert
      expect(inflightChecks).toStrictEqual([{ id: 'A' }, { id: 'B' }, { id: 'C' }]);
    });

    it('it is not array', () => {
      // Arrange
      const cluster: ClusterFromSubscription = {
        ...defaultClusterFromSubscription,
        inflight_checks: 'whatever' as any,
      };

      // Act
      const inflightChecks = getInflightChecks(cluster);

      // Assert
      expect(inflightChecks).toStrictEqual([]);
    });

    it('cluster undefined', () => {
      // Act
      const inflightChecks = getInflightChecks();

      // Assert
      expect(inflightChecks).toStrictEqual([]);
    });
  });
});
