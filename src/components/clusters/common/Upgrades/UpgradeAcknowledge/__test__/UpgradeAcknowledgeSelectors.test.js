import { getToVersionFromState, getClusterAcks, getAutomaticUpgradePolicyId } from '../UpgradeAcknowledgeSelectors';

describe('Upgrade Acknowledge Selectors', () => {
  let state;

  beforeEach(() => {
    state = {
      clusters: {
        upgradeGates: {
          gates: [
            {
              id: '1', version_raw_id_prefix: '4.2', title: 'upgrade to 4.2', sts_only: false,
            },
            {
              id: '2', version_raw_id_prefix: '4.3', title: 'upgrade to 4.3', sts_only: false,
            },
            {
              id: '3', version_raw_id_prefix: '4.3', title: 'upgrade to 4.3 met', sts_only: false,
            },
            {
              id: '4', version_raw_id_prefix: '4.3', title: 'upgrade to 4.3 sts only', sts_only: true,
            },
            {
              id: '5', version_raw_id_prefix: '4.4', title: 'upgrade to 4.4', sts_only: false,
            },
            {
              id: '6', version_raw_id_prefix: '4.4', title: 'upgrade to 4.4 met', sts_only: false,
            },
            {
              id: '7', version_raw_id_prefix: '5.3', title: 'upgrade to 5.3', sts_only: false,
            },
            {
              id: '8', version_raw_id_prefix: '5.4', title: 'upgrade to 5.4', sts_only: false,
            },
            {
              id: '9', version_raw_id_prefix: '5.4', title: 'upgrade to 5.4 met', sts_only: false,
            },
          ],
        },
        details: {
          cluster: {
            id: 'myClusterId',
            version: {
              available_upgrades: ['4.2.18', '4.2.19', '4.3.2', '4.3.4'],
              raw_id: '4.2.10',
            },
            upgradeGates: [
              { version_gate: { id: 'oldGate' } },
              { version_gate: { id: '3' } },
              { version_gate: { id: '6' } },
              { version_gate: { id: '9' } },
            ],
          },
        },
      },
      clusterUpgrades: {
        schedules: {
          items: [
            { schedule_type: 'automatic', version: '', id: 'myUpgradePolicyID' },
          ],
        },
      },
    };
  });
  describe('GetToVersionFromState tests', () => {
    it('getToVersionFromState returns last in available upgrades, if not scheduled updates', () => {
      state = { clusters: { details: { cluster: { version: { available_upgrades: ['1.2.3', '3.4.5', '1.1.1'] } } } } };
      expect(getToVersionFromState(state)).toEqual('1.1.1');
    });

    it('getToVersionFromState returns null if versions not available and no scheduled updates', () => {
      state = { clusters: { details: { cluster: { version: { available_upgrades: [] } } } } };
      expect(getToVersionFromState(state)).toBeNull();

      state = { clusters: { details: { cluster: { version: {} } } } };
      expect(getToVersionFromState(state)).toBeNull();

      state = { clusters: { details: { cluster: {} } } };
      expect(getToVersionFromState(state)).toBeNull();
    });

    it('getToVersionFromState gets version of scheduled update if available', () => {
      state = {
        clusters: { details: { cluster: { version: { available_upgrades: ['1.2.3', '3.4.5', '1.1.1'] } } } },
        clusterUpgrades: { schedules: { items: [{ version: '2.2.2' }] } },
      };
      expect(getToVersionFromState(state)).toEqual('2.2.2');
    });
  });

  describe('GetClusterAcks tests', () => {
    it('getClusterAcks returns empty if cluster id is unavailable', () => {
      state = {
        clusters: { details: { cluster: {} } },
      };
      expect(getClusterAcks(state)).toEqual([[], []]);
      expect(getClusterAcks({})).toEqual([[], []]);
    });

    it('getClusterAcks returns expected arrays for non sts cluster', () => {
      const [unMet, met] = getClusterAcks(state);

      expect(unMet).toEqual([
        {
          id: '2',
          version_raw_id_prefix: '4.3',
          title: 'upgrade to 4.3',
          sts_only: false,
        },
      ]);

      expect(met).toEqual([{ version_gate: { id: '3' } }]);
    });

    it('getClusterAcks returns expected arrays for sts cluster', () => {
      state.clusters.details.cluster.aws = { sts: { role_arn: 'myAWSRoleArn' } };
      const [unMet, met] = getClusterAcks(state);

      expect(unMet).toEqual([
        {
          id: '2',
          version_raw_id_prefix: '4.3',
          title: 'upgrade to 4.3',
          sts_only: false,
        },
        {
          id: '4',
          version_raw_id_prefix: '4.3',
          title: 'upgrade to 4.3 sts only',
          sts_only: true,
        },
      ]);

      expect(met).toEqual([{ version_gate: { id: '3' } }]);
    });

    it('getClustersAcks uses upgradeVersion when passed - patch upgrade returns empty results', () => {
      expect(getClusterAcks(state, '4.2')).toEqual([[], []]);
    });

    it('getClustersAcks uses upgradeVersion when passed - minor upgrade returns results', () => {
      state.clusters.details.cluster.version.available_upgrades = ['4.2.18', '4.2.19'];
      const [unMet, met] = getClusterAcks(state, '4.3');

      expect(unMet).toEqual([
        {
          id: '2',
          version_raw_id_prefix: '4.3',
          title: 'upgrade to 4.3',
          sts_only: false,
        },
      ]);

      expect(met).toEqual([{ version_gate: { id: '3' } }]);
    });

    it('getClustersAcks returns expected arrays for multiple y-stream (aka minor) upgrades ', () => {
      state.clusters.details.cluster.version.available_upgrades = ['4.2.18', '4.2.19', '4.3.2', '4.3.4', '4.4.4'];
      const [unMet, met] = getClusterAcks(state);

      expect(unMet).toEqual([
        {
          id: '2',
          version_raw_id_prefix: '4.3',
          title: 'upgrade to 4.3',
          sts_only: false,
        },
        {
          id: '5',
          version_raw_id_prefix: '4.4',
          title: 'upgrade to 4.4',
          sts_only: false,
        },
      ]);

      expect(met).toEqual([{ version_gate: { id: '3' } }, { version_gate: { id: '6' } }]);
    });

    it('getClustersAcks returns expected arrays for multiple major upgrades ', () => {
      state.clusters.details.cluster.version.available_upgrades = ['4.2.18', '4.2.19', '4.3.2', '4.3.4', '5.4.4'];
      const [unMet, met] = getClusterAcks(state);

      expect(unMet).toEqual([
        {
          id: '2',
          version_raw_id_prefix: '4.3',
          title: 'upgrade to 4.3',
          sts_only: false,
        },
        {
          id: '5',
          version_raw_id_prefix: '4.4',
          title: 'upgrade to 4.4',
          sts_only: false,
        },
        {
          id: '7',
          version_raw_id_prefix: '5.3',
          title: 'upgrade to 5.3',
          sts_only: false,
        },
        {
          id: '8',
          version_raw_id_prefix: '5.4',
          title: 'upgrade to 5.4',
          sts_only: false,
        },
      ]);

      expect(met).toEqual([{ version_gate: { id: '3' } }, { version_gate: { id: '6' } }, { version_gate: { id: '9' } }]);
    });

    it('fail gracefully if from version is unknown', () => {
      state.clusters.details.cluster.version.raw_id = '';
      expect(getClusterAcks(state)).toEqual([[], []]);
      state.clusters.details.cluster.version.raw_id = undefined;
      expect(getClusterAcks(state)).toEqual([[], []]);
    });

    it('fail gracefully if to version is unknown', () => {
      state.clusters.details.cluster.version.available_upgrades = [];
      expect(getClusterAcks(state)).toEqual([[], []]);
      state.clusters.details.cluster.version.available_upgrades = undefined;
      expect(getClusterAcks(state)).toEqual([[], []]);
    });

    it('fail gracefully if gate version is unknown', () => {
      state.clusters.upgradeGates.gates[0].version_raw_id_prefix = '';
      expect(getClusterAcks(state)).toEqual([[{
        id: '2',
        version_raw_id_prefix: '4.3',
        title: 'upgrade to 4.3',
        sts_only: false,
      }], [
        { version_gate: { id: '3' } },
      ]]);
    });
  });

  describe('GetAutomaticUpgradePolicyId tests', () => {
    it('Returns correct policyId for automatic', () => {
      expect(getAutomaticUpgradePolicyId(state)).toEqual('myUpgradePolicyID');
    });

    it('Returns undefined, for manual', () => {
      state.clusterUpgrades.schedules.items[0].schedule_type = 'manual';
      expect(getAutomaticUpgradePolicyId(state)).toBeUndefined();
    });
  });
});
