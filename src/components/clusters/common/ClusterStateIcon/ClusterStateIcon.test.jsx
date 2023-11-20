import React from 'react';
import { render } from '~/testUtils';

import ClusterStateIcon from './ClusterStateIcon';

// NOTE there is no way to really know what icon is displayed, so we are depending on a data attribute

describe('<ClusterStateIcon />', () => {
  it.each([
    ['unknown', 'whatever'],
    ['unknown', 'warning'],
    ['inprogress', 'pending'],
    ['inprogress', 'installing'],
    ['inprogress', 'uninstalling'],
    ['exclamation', 'error'],
    ['check', 'ready'],
    [undefined, 'unknown'],
  ])('renders %p icon for %p state', (icon, state) => {
    const { container } = render(<ClusterStateIcon clusterState={state} />);
    expect(container.querySelector('svg')).toHaveAttribute('data-icon-type', icon);
  });
});
