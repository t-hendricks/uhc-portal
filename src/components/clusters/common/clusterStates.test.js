import sample from 'lodash/sample';
import keys from 'lodash/keys';
import set from 'lodash/set';
import forOwn from 'lodash/forOwn';
import * as OCM from '@openshift-assisted/ui-lib/ocm';
import { normalizedProducts, subscriptionStatuses } from '../../../common/subscriptionTypes';
import clusterStates, {
  getClusterStateAndDescription,
  isWaitingROSAManualMode,
} from './clusterStates';

const mockCluster = (data) => {
  const cluster = {
    state: '',
    status: '',
    managed: Math.random() < 0.5, // getClusterStateAndDescription should not rely on managed field.
    subscription: {},
    metrics: {},
  };
  forOwn(data, (val, path) => set(cluster, path, val));
  return cluster;
};

describe('getClusterStateAndDescription', () => {
  it('should not handle AssistedInstall states', () => {
    const AIStatus = sample(keys(OCM.Constants.CLUSTER_STATUS_LABELS));
    const cluster = mockCluster({
      status: AIStatus,
      'subscription.plan.id': normalizedProducts.OCP_Assisted_Install,
      'subscription.plan.type': 'OCP',
      'subscription.status': subscriptionStatuses.DISCONNECTED,
    });
    const result = getClusterStateAndDescription(cluster);
    expect(result.description).toEqual('Disconnected');
  });

  it('should show OCP updating', () => {
    const cluster = mockCluster({ 'metrics.upgrade.state': 'running' });
    const result = getClusterStateAndDescription(cluster);
    expect(result.description).toEqual('Updating');
  });

  it('should show descriptions derived from the subscription status', () => {
    const expectDescription = (subStatus, expectedDescription) => {
      const cluster = mockCluster({ 'subscription.status': subStatus });
      const result = getClusterStateAndDescription(cluster);
      expect(result.description).toEqual(expectedDescription);
    };
    expectDescription(subscriptionStatuses.ACTIVE, 'Ready');
    expectDescription(subscriptionStatuses.STALE, 'Stale');
    expectDescription(subscriptionStatuses.ARCHIVED, 'Archived');
    expectDescription(subscriptionStatuses.DEPROVISIONED, 'Deleted');
    expectDescription(subscriptionStatuses.DISCONNECTED, 'Disconnected');
  });

  it('should show descriptions derived from the cluster state', () => {
    const expectDescription = (state, expectedDescription) => {
      const cluster = mockCluster({ state });
      const result = getClusterStateAndDescription(cluster);
      expect(result.description).toEqual(expectedDescription);
    };
    expectDescription(clusterStates.WAITING, 'Waiting');
    expectDescription(clusterStates.PENDING, 'Installing');
    expectDescription(clusterStates.INSTALLING, 'Installing');
    expectDescription(clusterStates.READY, 'Ready');
    expectDescription(clusterStates.UNINSTALLING, 'Uninstalling');
    expectDescription(clusterStates.RESUMING, 'Resuming');
    expectDescription(clusterStates.HIBERNATING, 'Hibernating');
    expectDescription(clusterStates.ERROR, 'Error');
    expectDescription(clusterStates.POWERING_DOWN, 'Powering down');
  });

  describe('isWaitingROSAManualMode()', () => {
    const ROSAManualCluster = {
      state: 'waiting',
      hypershift: { enabled: false },
      product: { id: 'ROSA' },
      aws: { sts: { auto_mode: false, oidc_config: {} } },
    };

    it('returns true when is rosa and has a missing oidc config ', () => {
      expect(isWaitingROSAManualMode(ROSAManualCluster)).toBeTruthy();
    });

    it('returns false when state is not in waiting', () => {
      const readyCluster = { ...ROSAManualCluster, state: 'ready' };
      expect(isWaitingROSAManualMode(readyCluster)).toBeFalsy();
    });

    it('return false when is hypershift cluster', () => {
      const hypershiftCluster = { ...ROSAManualCluster, hypershift: { enabled: true } };
      expect(isWaitingROSAManualMode(hypershiftCluster)).toBeFalsy();
    });

    it('returns false when is not a ROSA cluster', () => {
      const OSDCluster = { ...ROSAManualCluster, product: { id: 'OSD' } };
      expect(isWaitingROSAManualMode(OSDCluster)).toBeFalsy();
    });

    it('returns false when it is sts auto mode', () => {
      const stsAutoModeCluster = { ...ROSAManualCluster, aws: { sts: { auto_mode: true } } };
      expect(isWaitingROSAManualMode(stsAutoModeCluster)).toBeFalsy();
    });

    it('returns false when there is a oidc config', () => {
      const oidcReadyCluster = {
        ...ROSAManualCluster,
        aws: { sts: { auto_mode: false, oidc_config: { id: 'my-oidc-id' } } },
      };
      expect(isWaitingROSAManualMode(oidcReadyCluster)).toBeFalsy();
    });
  });
});
