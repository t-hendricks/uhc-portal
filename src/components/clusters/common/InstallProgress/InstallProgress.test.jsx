import React from 'react';
import { render, screen, checkAccessibility } from '~/testUtils';
import InstallProgress from './InstallProgress';
import clusterStates from '../clusterStates';
import fixtures from '../../ClusterDetails/__tests__/ClusterDetails.fixtures';

describe('<InstallProgress />', () => {
  const clusterInstalling = {
    ...fixtures.clusterDetails.cluster,
    state: clusterStates.INSTALLING,
  };

  it('is accessible when installing cluster', async () => {
    const { container } = render(<InstallProgress cluster={clusterInstalling} />);

    expect(screen.getByText('Installing cluster')).toBeInTheDocument();
    await checkAccessibility(container);
  });

  it('returns empty component  when uninstalling cluster', () => {
    const uninstallingCluster = { ...clusterInstalling, state: clusterStates.UNINSTALLING };
    const { container } = render(<InstallProgress cluster={uninstallingCluster} />);

    expect(container).toBeEmptyDOMElement();
  });
});
