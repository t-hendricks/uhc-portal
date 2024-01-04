import { baseRequestState } from '~/redux/reduxHelpers';
import { normalizedProducts } from '~/common/subscriptionTypes';
import {
  hasMachinePoolsQuotaSelector,
  hasOrgLevelAutoscaleCapability,
  hasOrgLevelBypassPIDsLimitCapability,
} from '../MachinePoolsSelectors';
import { stateWithQuota, stateWithNoQuota } from './MachinePools.fixtures';

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

  describe('hasOrgLevelBypassPIDsLimitCapability', () => {
    it.each([
      ['returns true if the capability is present', 'true', true],
      ['returns false if the capability is absent', 'false', false],
    ])('%p', (title, capabilityValue, expected) => {
      // Arrange
      const state = {
        userProfile: {
          organization: {
            details: {
              capabilities: [
                {
                  name: 'capability.organization.bypass_pids_limits',
                  value: capabilityValue,
                  inherited: false,
                },
              ],
            },
          },
        },
      };
      // Act
      const result = hasOrgLevelBypassPIDsLimitCapability(state);
      // Assert
      expect(result).toBe(expected);
    });
  });
});
