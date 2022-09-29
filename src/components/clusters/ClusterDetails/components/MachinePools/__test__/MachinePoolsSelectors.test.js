import {
  hasMachinePoolsQuotaSelector,
  hasOrgLevelAutoscaleCapability,
  canAutoScaleSelector,
} from '../MachinePoolsSelectors';
import { baseRequestState } from '../../../../../../redux/reduxHelpers';
import { stateWithQuota, stateWithNoQuota } from './MachinePools.fixtures';
import { normalizedProducts } from '../../../../../../common/subscriptionTypes';

describe('machinePoolsSelector', () => {
  const stateWithoutAutoscaleCapability = {
    userProfile: {
      organization: {
        details: {
          capabilities: [
            { name: 'capability.account.create_moa_clusters', value: 'true', inherited: false },
            { name: 'capability.account.allow_etcd_encryption', value: 'false', inherited: false },
            { name: 'capability.cluster.autoscale_clusters', value: 'false', inherited: false },
            { name: 'capability.cluster.subscribed_ocp', value: 'true', inherited: false },
          ],
        },
      },
    },
  };

  const stateWithAutoscaleCapability = {
    userProfile: {
      organization: {
        details: {
          capabilities: [
            { name: 'capability.account.create_moa_clusters', value: 'true', inherited: false },
            { name: 'capability.account.allow_etcd_encryption', value: 'false', inherited: false },
            { name: 'capability.cluster.autoscale_clusters', value: 'true', inherited: false },
            { name: 'capability.cluster.subscribed_ocp', value: 'true', inherited: false },
          ],
        },
      },
    },
  };

  const stateWithClusterAutoscaleCapability = {
    clusters: {
      details: {
        cluster: {
          subscription: {
            capabilities: [
              { name: 'capability.cluster.autoscale_clusters', value: 'true', inherited: false },
              { name: 'capability.cluster.subscribed_ocp', value: 'true', inherited: false },
            ],
          },
        },
      },
    },
  };

  it('should return false when quota is not fetched yet', () => {
    const organiztionNotFulfilledState = {
      userProfile: { organization: { ...baseRequestState } },
    };
    const result = hasMachinePoolsQuotaSelector(organiztionNotFulfilledState);
    expect(result).toBe(false);
  });

  it('should return true when user has quota for additional machine pools', () => {
    const result = hasMachinePoolsQuotaSelector(stateWithQuota);
    expect(result).toBe(true);
  });

  it('should return false when user has no quota for additional machine pools', () => {
    const result = hasMachinePoolsQuotaSelector(stateWithNoQuota);
    expect(result).toBe(false);
  });

  it('should return true when org users can set autoscaling', () => {
    const result = hasOrgLevelAutoscaleCapability(
      stateWithAutoscaleCapability,
      normalizedProducts.OSD,
    );
    expect(result).toBe(true);
  });

  it('should return false when org users cannot set autoscaling', () => {
    const result = hasOrgLevelAutoscaleCapability(
      stateWithoutAutoscaleCapability,
      normalizedProducts.OSD,
    );
    expect(result).toBe(false);
  });

  it('should allow autoscaling for ROSA clusters', () => {
    const result = canAutoScaleSelector({}, normalizedProducts.ROSA);
    expect(result).toBe(true);
  });

  it('should allow autoscaling for RHM OSD clusters', () => {
    const result = canAutoScaleSelector(
      stateWithClusterAutoscaleCapability,
      normalizedProducts.OSD,
    );
    expect(result).toBe(true);
  });

  it('should not allow autoscaling', () => {
    const result = canAutoScaleSelector(stateWithoutAutoscaleCapability, normalizedProducts.OCP);
    expect(result).toBe(false);
  });

  it('should not allow autoscaling for ARO clusters', () => {
    const result = canAutoScaleSelector(stateWithoutAutoscaleCapability, normalizedProducts.ARO);
    expect(result).toBe(false);
  });
});
