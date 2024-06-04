import React from 'react';

import { subscriptionStatuses } from '~/common/subscriptionTypes';
import { render } from '~/testUtils';

import fixtures from '../../ClusterDetails/__tests__/ClusterDetails.fixtures';
import InfrastructureModelLabel from '../InfrastructureModelLabel';

describe('InfrastructureModelLabel', () => {
  it('for OSD rhInfra cluster', () => {
    const { cluster } = fixtures.clusterDetails;
    const { container } = render(<InfrastructureModelLabel cluster={cluster} />);
    expect(container).toHaveTextContent('Red Hat cloud account');
  });

  it('for OSD CCS cluster', () => {
    const { cluster } = fixtures.CCSClusterDetails;
    const { container } = render(<InfrastructureModelLabel cluster={cluster} />);
    expect(container).toHaveTextContent('Customer cloud subscription');
  });

  it('for OSDTrial CCS cluster', () => {
    const { cluster } = fixtures.OSDTrialClusterDetails;
    const { container } = render(<InfrastructureModelLabel cluster={cluster} />);
    expect(container).toHaveTextContent('Customer cloud subscription');
  });

  it('for OSD GCP CCS archived cluster', () => {
    const cluster = {
      ...fixtures.OSDGCPClusterDetails.cluster,
      state: subscriptionStatuses.DEPROVISIONED,
      ccs: undefined,
    };
    const { container } = render(<InfrastructureModelLabel cluster={cluster} />);
    expect(container).toHaveTextContent('N/A');
  });
});
