import React from 'react';
import { render, screen, checkAccessibility } from '~/testUtils';

import UpdateGraph from './UpdateGraph';

describe('<UpdateGraph />', () => {
  it('is accessible', async () => {
    const { container } = render(
      <UpdateGraph currentVersion="current version" updateVersion="next version" />,
    );

    expect(container.querySelectorAll('.ocm-upgrade-graph-version')).toHaveLength(2);
    expect(screen.getByText('current version')).toHaveClass('ocm-upgrade-graph-version');
    expect(screen.getByText('next version')).toHaveClass('ocm-upgrade-graph-version');

    // There currently isn't another way to select these elements
    expect(container.querySelectorAll('.ocm-upgrade-graph-version-dot')).toHaveLength(2);

    expect(screen.queryByText(/Additional versions available/)).not.toBeInTheDocument();

    await checkAccessibility(container);
  });

  it('should render with no updates available', () => {
    const { container } = render(<UpdateGraph currentVersion="1.2.3" />);

    expect(screen.getByText('1.2.3')).toHaveClass('ocm-upgrade-graph-version');
    expect(container.querySelectorAll('.ocm-upgrade-graph-version')).toHaveLength(1);

    expect(container.querySelectorAll('.ocm-upgrade-graph-version-dot')).toHaveLength(1);

    expect(screen.queryByText(/Additional versions available/)).not.toBeInTheDocument();
  });

  it('should render when additional versions are available', () => {
    const { container } = render(
      <UpdateGraph currentVersion="1.2.3" updateVersion="1.2.4" hasMore />,
    );

    expect(container.querySelectorAll('.ocm-upgrade-graph-version')).toHaveLength(2);
    expect(screen.getByText('1.2.3')).toHaveClass('ocm-upgrade-graph-version');
    expect(screen.getByText('1.2.4')).toHaveClass('ocm-upgrade-graph-version');

    expect(container.querySelectorAll('.ocm-upgrade-graph-version-dot')).toHaveLength(2);

    expect(
      screen.getByText('Additional versions available between 1.2.3 and 1.2.4'),
    ).toBeInTheDocument();
  });
});
