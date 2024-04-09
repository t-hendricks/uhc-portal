import React from 'react';

import { render, screen } from '~/testUtils';

import ClusterUpdateLink from '../ClusterUpdateLink';

describe('<ClusterUpdateLink />', () => {
  it('renders null for OCP when no upgrades are available', () => {
    const cluster = {
      managed: false,
      metrics: {
        upgrade: {
          available: false,
        },
      },
    };

    const { container } = render(<ClusterUpdateLink cluster={cluster} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders null for OCP when cluster.subscription.status === Stale', () => {
    const cluster = {
      managed: false,
      metrics: {
        upgrade: {
          available: true,
        },
      },
      subscription: {
        status: 'Stale',
      },
    };
    const { container } = render(<ClusterUpdateLink cluster={cluster} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders null for OSD when cluster.subscription.status === Stale', () => {
    const cluster = {
      managed: true,
      metrics: {
        upgrade: {
          available: true,
        },
      },
      subscription: {
        status: 'Stale',
      },
    };
    const { container } = render(<ClusterUpdateLink cluster={cluster} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows next version numbers when an upgrade is running', () => {
    const cluster = {
      openshift_version: 'some-old-version',
      version: {
        raw_id: 'some-old-version',
      },
      metrics: {
        upgrade: {
          available: true,
          state: 'running',
          version: 'some-new-version',
        },
      },
    };

    render(<ClusterUpdateLink cluster={cluster} />);
    expect(screen.getByText('→ some-new-version')).toBeInTheDocument();
  });
});
