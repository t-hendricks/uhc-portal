import React from 'react';
import { render, screen, axe } from '@testUtils';
import { MemoryRouter } from 'react-router-dom';

import CloudTab from '../CloudTab';

describe('<CloudTab />', () => {
  it('should render correctly with quota', () => {
    const { container } = render(
      <MemoryRouter>
        <CloudTab hasOSDQuota trialEnabled={false} />
      </MemoryRouter>,
    );

    // PF manually changes the role from table to "grid"
    expect(screen.getAllByRole('grid')).toHaveLength(2);

    expect(screen.getByTestId('osd-create-cluster-button')).toBeInTheDocument();
    expect(screen.queryByTestId('osd-learn-more-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('osd-create-trial-cluster')).not.toBeInTheDocument();
    expect(screen.getByTestId('osd-view-available-quota-link')).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });
  it('is accessible with with quota', async () => {
    const { container } = render(
      <MemoryRouter>
        <CloudTab hasOSDQuota trialEnabled={false} />
      </MemoryRouter>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should render correctly without quota', () => {
    const { container } = render(
      <MemoryRouter>
        <CloudTab hasOSDQuota={false} trialEnabled={false} />
      </MemoryRouter>,
    );

    // PF manually changes the role from table to "grid"
    expect(screen.getAllByRole('grid')).toHaveLength(2);

    expect(screen.queryByTestId('osd-create-cluster-button')).not.toBeInTheDocument();
    expect(screen.getByTestId('osd-learn-more-button')).toBeInTheDocument();
    expect(screen.queryByTestId('osd-create-trial-cluster')).not.toBeInTheDocument();
    expect(screen.queryByTestId('osd-view-available-quota-link')).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  it('is accessible without quota', async () => {
    const { container } = render(
      <MemoryRouter>
        <CloudTab hasOSDQuota={false} trialEnabled={false} />
      </MemoryRouter>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should render correctly with OSD Trial quota', () => {
    const { container } = render(
      <MemoryRouter>
        <CloudTab hasOSDQuota={false} trialEnabled />
      </MemoryRouter>,
    );

    // PF manually changes the role from table to "grid"
    expect(screen.getAllByRole('grid')).toHaveLength(2);

    expect(screen.queryByTestId('osd-create-cluster-button')).not.toBeInTheDocument();
    expect(screen.getByTestId('osd-learn-more-button')).toBeInTheDocument();
    expect(screen.getByTestId('osd-create-trial-cluster')).toBeInTheDocument();
    expect(screen.getByTestId('osd-view-available-quota-link')).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  it('is accessible with OSD trial quota', async () => {
    const { container } = render(
      <MemoryRouter>
        <CloudTab hasOSDQuota={false} trialEnabled />
      </MemoryRouter>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should render correctly with both trial and quota', () => {
    const { container } = render(
      <MemoryRouter>
        <CloudTab hasOSDQuota trialEnabled />
      </MemoryRouter>,
    );

    // PF manually changes the role from table to "grid"
    expect(screen.getAllByRole('grid')).toHaveLength(2);

    expect(screen.getByTestId('osd-create-cluster-button')).toBeInTheDocument();
    expect(screen.queryByTestId('osd-learn-more-button')).not.toBeInTheDocument();
    expect(screen.getByTestId('osd-create-trial-cluster')).toBeInTheDocument();
    expect(screen.getByTestId('osd-view-available-quota-link')).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  it('is accessible with both trial and quota', async () => {
    const { container } = render(
      <MemoryRouter>
        <CloudTab hasOSDQuota trialEnabled />
      </MemoryRouter>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
