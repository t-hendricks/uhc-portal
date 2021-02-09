import { hasMachinePoolsQuotaSelector, hasOrgLevelAutoscaleCapability, canAutoScaleSelector } from '../MachinePoolsSelectors';
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
            { name: 'capability.organization.autoscale_clusters', value: 'false', inherited: false },
            { name: 'capability.cluster.subscribed_ocp', value: 'true', inherited: false },
          ],
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
    const stateWithCapability = {
      userProfile: {
        organization: {
          details: {
            capabilities: [
              { name: 'capability.account.create_moa_clusters', value: 'true', inherited: false },
              { name: 'capability.account.allow_etcd_encryption', value: 'false', inherited: false },
              { name: 'capability.organization.autoscale_clusters', value: 'true', inherited: false },
              { name: 'capability.cluster.subscribed_ocp', value: 'true', inherited: false },
            ],
          },
        },
      },
    };
    const result = hasOrgLevelAutoscaleCapability(stateWithCapability, normalizedProducts.OSD, 'aws');
    expect(result).toBe(true);
  });

  it('should return false when org users cannot set autoscaling', () => {
    const result = hasOrgLevelAutoscaleCapability(stateWithoutAutoscaleCapability, normalizedProducts.OSD, 'aws');
    expect(result).toBe(false);
  });

  it('should allow autoscaling for ROSA clusters', () => {
    const result = canAutoScaleSelector({}, normalizedProducts.ROSA, 'aws');
    expect(result).toBe(true);
  });

  it('should not allow autoscaling', () => {
    const result = canAutoScaleSelector(stateWithoutAutoscaleCapability, normalizedProducts.OCP, 'aws');
    expect(result).toBe(false);
  });

  it('should not allow autoscaling for gcp clusters', () => {
    const result = hasOrgLevelAutoscaleCapability(stateWithoutAutoscaleCapability, normalizedProducts.OSD, 'gcp');
    expect(result).toBe(false);
  });
});
