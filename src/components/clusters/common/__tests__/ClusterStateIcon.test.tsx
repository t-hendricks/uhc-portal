import React from 'react';

import { render, screen } from '~/testUtils';

import ClusterStateIcon from '../ClusterStateIcon';

// NOTE there is no way to really know what icon is displayed, so we are depending on a data attribute
describe('<ClusterStateIcon />', () => {
  it.each([
    ['whatever', 'unknown'],
    ['warning', 'unknown'],
    ['pending', 'inprogress'],
    ['installing', 'inprogress'],
    ['uninstalling', 'inprogress'],
    ['error', 'exclamation'],
    ['ready', 'check'],
    ['unknown', undefined],
    ['deprovisioned', 'deprovisioned'],
    ['archived', 'archived'],
  ])('state %p renders the icon %p', (state, expectedIcon) => {
    const { container } = render(<ClusterStateIcon clusterState={state} />);
    expect(container.querySelector('svg')).toHaveAttribute('data-icon-type', expectedIcon);
  });

  it.each([
    ['warning', 'unknown'],
    ['pending'],
    ['installing'],
    ['uninstalling'],
    ['error', true],
    ['ready', true],
    ['unknown', true],
  ])('renders %p icon for %p state when animated is true', (state, expectedIcon = undefined) => {
    render(<ClusterStateIcon clusterState={state} animated />);
    if (expectedIcon) {
      expect(screen.queryByRole('progressbar', { name: /contents/i })).not.toBeInTheDocument();
    } else {
      expect(screen.getByRole('progressbar', { name: /contents/i })).toBeInTheDocument();
    }
  });

  it.each([
    ['error', true, 'exclamation'],
    ['error', false, 'exclamation'],
    ['pending', true, 'limited-support'],
    ['pending', false, 'inprogress'],
  ])(
    'renders %p icon for %p state when limited support is %p',
    (state, limitedSupport, expectedIcon) => {
      const { container } = render(
        <ClusterStateIcon clusterState={state} limitedSupport={limitedSupport} />,
      );
      expect(container.querySelector('svg')).toHaveAttribute('data-icon-type', expectedIcon);
    },
  );
});
