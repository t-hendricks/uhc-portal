import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, checkAccessibility } from '~/testUtils';

import TabsRow from './TabsRow';

const tabNames = {
  overview: 'Overview',
  monitoring: 'Monitoring',
  accesscontrol: 'Access control',
  addons: 'Add-ons',
};

type PropType = {
  [key: string]: unknown;
};

describe('<TabsRow />', () => {
  let props: PropType;
  beforeEach(() => {
    const mockRef = { current: null };
    props = {
      overviewTabRef: mockRef,
      accessControlTabRef: mockRef,
      monitoringTabRef: mockRef,
      addOnsTabRef: mockRef,
      insightsTabRef: mockRef,
      machinePoolsTabRef: mockRef,
      networkingTabRef: mockRef,
      supportTabRef: mockRef,
      upgradeSettingsTabRef: mockRef,
      addAssistedTabRef: mockRef,
      hasIssues: false,
      setOpenedTab: jest.fn(),
      onTabSelected: jest.fn(),
    };
  });

  it.skip('is accessible', async () => {
    // This throws an error because the tabs are not tied to the content in this component.
    // Arrange
    const tabProps = { ...props, displayAccessControlTab: true, displayAddOnsTab: true };
    const { container } = render(
      <MemoryRouter keyLength={0} initialEntries={[{ pathname: '/details/s/:id', key: 'testKey' }]}>
        <TabsRow {...tabProps} />
      </MemoryRouter>,
    );

    // Assert
    await checkAccessibility(container);
  });

  it('show only overview, access control, monitoring, and add-ons tabs', () => {
    // Arrange
    const tabProps = { ...props, displayAccessControlTab: true, displayAddOnsTab: true };
    render(
      <MemoryRouter keyLength={0} initialEntries={[{ pathname: '/details/s/:id', key: 'testKey' }]}>
        <TabsRow {...tabProps} />
      </MemoryRouter>,
    );

    // Assert
    expect(screen.getAllByRole('tab')).toHaveLength(4);

    expect(
      screen.getByRole('tab', { name: tabNames.overview, selected: true }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('tab', { name: tabNames.monitoring, selected: false }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('tab', { name: tabNames.accesscontrol, selected: false }),
    ).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: tabNames.addons, selected: false })).toBeInTheDocument();
  });

  it('hide monitoring and add-ons tabs based on passed props', () => {
    // Arrange
    const tabProps = {
      ...props,
      displayAccessControlTab: true,
      displayAddOnsTab: false,
      displayMonitoringTab: false,
    };
    render(
      <MemoryRouter keyLength={0} initialEntries={[{ pathname: '/details/s/:id', key: 'testKey' }]}>
        <TabsRow {...tabProps} />
      </MemoryRouter>,
    );

    // Assert
    expect(screen.getAllByRole('tab')).toHaveLength(2);
    expect(screen.queryByRole('tab', { name: tabNames.monitoring })).not.toBeInTheDocument();
    expect(screen.queryByRole('tab', { name: tabNames.addons })).not.toBeInTheDocument();

    expect(
      screen.getByRole('tab', { name: tabNames.overview, selected: true }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('tab', { name: tabNames.accesscontrol, selected: false }),
    ).toBeInTheDocument();
  });

  it('shows monitoring tab with issues icon when hasIssues prop is passed', () => {
    // Arrange
    const tabProps = {
      ...props,
      hasIssues: true,
    };
    render(
      <MemoryRouter keyLength={0} initialEntries={[{ pathname: '/details/s/:id', key: 'testKey' }]}>
        <TabsRow {...tabProps} />
      </MemoryRouter>,
    );

    // Assert

    // There is an accessibility issue with the warning icon.
    // It doesn't have an accessible label and is hidden (with aria-hidden) so it is not easily found
    expect(
      screen.getByRole('tab', { name: tabNames.monitoring }).querySelector('svg.danger'),
    ).toBeInTheDocument();
  });
});
