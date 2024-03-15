import React from 'react';

import { render, screen, checkAccessibility } from '~/testUtils';
import ProgressList from './ProgressList';
import clusterStates from '../clusterStates';
import { normalizedProducts } from '../../../../common/subscriptionTypes';
import fixtures from '../../ClusterDetails/__tests__/ClusterDetails.fixtures';

describe('<ProgressList />', () => {
  const firstStepPending = {
    ...fixtures.clusterDetails.cluster,
    state: clusterStates.PENDING,
  };

  const firstStepCompleted = {
    ...fixtures.clusterDetails.cluster,
    state: clusterStates.INSTALLING,
  };

  const secondStepCompleted = {
    ...fixtures.clusterDetails.cluster,
    state: clusterStates.INSTALLING,
    dns_ready: true,
  };

  const rosaManualMode = {
    ...fixtures.clusterDetails.cluster,
    product: {
      id: normalizedProducts.ROSA,
    },
    aws: {
      sts: {
        auto_mode: false,
      },
    },
    state: clusterStates.WAITING,
  };

  it('when cluster is pending, the first step is complete and second step is validating', async () => {
    const { container } = render(<ProgressList cluster={firstStepPending} />);

    const steps = screen.getAllByRole('listitem');
    expect(steps).toHaveLength(4);

    expect(steps[0]).toHaveClass('pf-m-success');
    expect(steps[0].textContent).toEqual('Account setupCompleted');

    expect(steps[1]).toHaveAttribute('aria-current');
    expect(steps[1].textContent).toEqual('Network settingsValidating');

    expect(steps[2]).toHaveClass('pf-m-pending');
    expect(steps[3]).toHaveClass('pf-m-pending');

    await checkAccessibility(container);
  });

  it('when cluster is installing: first, second, third steps are complete', () => {
    render(<ProgressList cluster={firstStepCompleted} />);

    const steps = screen.getAllByRole('listitem');
    expect(steps).toHaveLength(4);

    expect(steps[0]).toHaveClass('pf-m-success');
    expect(steps[0].textContent).toEqual('Account setupCompleted');

    expect(steps[1]).toHaveClass('pf-m-success');
    expect(steps[1].textContent).toEqual('Network settingsCompleted');

    expect(steps[2]).toHaveClass('pf-m-success');
    expect(steps[2].textContent).toEqual('DNS setupCompleted');

    expect(steps[3]).toHaveAttribute('aria-current');
    expect(steps[3].textContent).toEqual('Cluster installationInstalling cluster');
  });

  it('when cluster is installing and dns is ready: first, second, third steps are complete', () => {
    render(<ProgressList cluster={secondStepCompleted} />);

    const steps = screen.getAllByRole('listitem');
    expect(steps).toHaveLength(4);

    expect(steps[0]).toHaveClass('pf-m-success');
    expect(steps[0].textContent).toEqual('Account setupCompleted');

    expect(steps[1]).toHaveClass('pf-m-success');
    expect(steps[1].textContent).toEqual('Network settingsCompleted');

    expect(steps[2]).toHaveClass('pf-m-success');
    expect(steps[2].textContent).toEqual('DNS setupCompleted');

    expect(steps[3]).toHaveAttribute('aria-current');
    expect(steps[3].textContent).toEqual('Cluster installationInstalling cluster');
  });

  it('should render for ROSA manual mode', () => {
    render(<ProgressList cluster={rosaManualMode} />);

    const steps = screen.getAllByRole('listitem');
    expect(steps).toHaveLength(5);

    expect(steps[0]).toHaveClass('pf-m-success');
    expect(steps[0].textContent).toEqual('Account setupCompleted');

    expect(steps[1]).toHaveAttribute('aria-current');
    expect(steps[1].textContent).toEqual('OIDC and operator rolesAction required');

    expect(steps[2]).toHaveClass('pf-m-pending');
    expect(steps[2].textContent).toEqual('Network settings');

    expect(steps[3]).toHaveClass('pf-m-pending');
    expect(steps[3].textContent).toEqual('DNS setup');

    expect(steps[4]).toHaveClass('pf-m-pending');
    expect(steps[4].textContent).toEqual('Cluster installation');
  });
});
