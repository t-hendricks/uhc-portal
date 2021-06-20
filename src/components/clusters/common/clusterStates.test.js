import sample from 'lodash/sample';
import keys from 'lodash/keys';
import set from 'lodash/set';
import forOwn from 'lodash/forOwn';
import { Config as AIConfig } from 'openshift-assisted-ui-lib';
import { normalizedProducts, subscriptionStatuses } from '../../../common/subscriptionTypes';
import clusterStates, { getClusterStateAndDescription } from './clusterStates';

const mockCluster = (data) => {
  const cluster = {
    state: '',
    status: '',
    managed: false,
    subscription: {},
    metrics: {},
  };
  forOwn(data, (val, path) => set(cluster, path, val));
  return cluster;
};

describe('getClusterStateAndDescription', () => {
  it('should use AssistedInstall states', () => {
    const AIStatus = sample(keys(AIConfig.CLUSTER_STATUS_LABELS));
    const planId = normalizedProducts.OCP_Assisted_Install;
    const cluster = mockCluster({
      status: AIStatus,
      'subscription.plan.id': planId,
    });
    const result = getClusterStateAndDescription(cluster);
    const AIState = AIConfig.CLUSTER_STATUS_LABELS[AIStatus];
    expect(result.state).toEqual(AIState);
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
      const cluster = mockCluster({ state, managed: true });
      const result = getClusterStateAndDescription(cluster);
      expect(result.description).toEqual(expectedDescription);
    };
    expectDescription(clusterStates.PENDING, 'Installing');
    expectDescription(clusterStates.INSTALLING, 'Installing');
    expectDescription(clusterStates.READY, 'Ready');
    expectDescription(clusterStates.UNINSTALLING, 'Uninstalling');
    expectDescription(clusterStates.RESUMING, 'Resuming');
    expectDescription(clusterStates.HIBERNATING, 'Hibernating');
    expectDescription(clusterStates.ERROR, 'Error');
    expectDescription(clusterStates.POWERING_DOWN, 'Powering down');
  });
});
