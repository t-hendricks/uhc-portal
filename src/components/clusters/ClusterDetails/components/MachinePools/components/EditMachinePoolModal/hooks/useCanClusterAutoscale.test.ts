import { normalizedProducts } from '~/common/subscriptionTypes';
import * as reduxHooks from '~/redux/hooks';

import useCanClusterAutoscale from './useCanClusterAutoscale';

const useGlobalStateMock = jest.spyOn(reduxHooks, 'useGlobalState');

describe('canAutoScale', () => {
  it('should allow autoscaling for ROSA clusters', () => {
    useGlobalStateMock.mockReturnValue(false);
    const result = useCanClusterAutoscale(normalizedProducts.ROSA);
    expect(result).toBe(true);
  });

  it('should allow autoscaling for RHM OSD clusters', () => {
    useGlobalStateMock.mockReturnValue(true);
    const result = useCanClusterAutoscale(normalizedProducts.OSD);
    expect(result).toBe(true);
  });

  it('should not allow autoscaling', () => {
    useGlobalStateMock.mockReturnValue(false);
    const result = useCanClusterAutoscale(normalizedProducts.OCP);
    expect(result).toBe(false);
  });

  it('should not allow autoscaling for ARO clusters', () => {
    useGlobalStateMock.mockReturnValue(false);
    const result = useCanClusterAutoscale(normalizedProducts.ARO);
    expect(result).toBe(false);
  });
});
