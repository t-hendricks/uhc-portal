import hasMachinePoolsQuotaSelector from '../MachinePoolsSelectors';
import { baseRequestState } from '../../../../../../redux/reduxHelpers';
import { stateWithQuota, stateWithNoQuota } from './MachinePools.fixtures';

describe('machinePoolsSelector', () => {
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
});
