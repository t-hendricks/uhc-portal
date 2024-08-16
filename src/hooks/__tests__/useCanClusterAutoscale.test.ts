import { billingModels, normalizedProducts } from '~/common/subscriptionTypes';
import * as reduxHooks from '~/redux/hooks';

import useCanClusterAutoscale from '../useCanClusterAutoscale';

const useGlobalStateMock = jest.spyOn(reduxHooks, 'useGlobalState');

describe('canAutoScale', () => {
  it('should allow autoscaling for ROSA clusters', () => {
    useGlobalStateMock.mockReturnValue(false);
    const result = useCanClusterAutoscale(normalizedProducts.ROSA, billingModels.MARKETPLACE_AWS);
    expect(result).toBe(true);
  });

  it('should allow autoscaling for OSD clusters with Red Hat marketplace billing accouunt', () => {
    useGlobalStateMock.mockReturnValue(true);
    const resultMarketPlaceRH = useCanClusterAutoscale(
      normalizedProducts.OSD,
      billingModels.MARKETPLACE,
    );
    const resultMarketPlaceRHM = useCanClusterAutoscale(
      normalizedProducts.OSD,
      billingModels.MARKETPLACE_RHM,
    );
    expect(resultMarketPlaceRH).toBe(true);
    expect(resultMarketPlaceRHM).toBe(true);
  });

  it('should allow autoscaling for OSD clusters with standard billing accouunt', () => {
    useGlobalStateMock.mockReturnValue(true);
    const resultMarketPlaceRH = useCanClusterAutoscale(
      normalizedProducts.OSD,
      billingModels.STANDARD,
    );
    expect(resultMarketPlaceRH).toBe(true);
  });

  it('should not allow autoscaling for OCP cluster', () => {
    useGlobalStateMock.mockReturnValue(false);
    const result = useCanClusterAutoscale(normalizedProducts.OCP, undefined);
    expect(result).toBe(false);
  });

  it('should not allow autoscaling for ARO clusters', () => {
    useGlobalStateMock.mockReturnValue(false);
    const result = useCanClusterAutoscale(normalizedProducts.ARO, undefined);
    expect(result).toBe(false);
  });

  it('should allow autoscaling for GCP-marketplace clusters', () => {
    useGlobalStateMock.mockReturnValue(false);
    const result = useCanClusterAutoscale(normalizedProducts.OSD, billingModels.MARKETPLACE_GCP);
    expect(result).toBe(true);
  });

  it('should not allow autoscaling for non marketplace clusters without autoscale capability', () => {
    useGlobalStateMock.mockReturnValue(false);
    const result = useCanClusterAutoscale(normalizedProducts.OSD, billingModels.STANDARD);
    expect(result).toBe(false);
  });

  it('should allow autoscaling when there is a cluster level autosacle capability', () => {
    useGlobalStateMock.mockReturnValue(false);
    const mockCapabilites = [
      { name: 'capability.cluster.subscribed_ocp', value: 'true', inherited: true },
      { name: 'capability.cluster.cluster', value: 'true', inherited: false },
    ];
    const result = useCanClusterAutoscale(
      normalizedProducts.OSD,
      billingModels.STANDARD,
      mockCapabilites,
    );
    expect(result).toBe(false);
  });
});
