/* eslint-disable testing-library/prefer-find-by */
/* eslint-disable testing-library/no-wait-for-multiple-assertions */
/* eslint-disable testing-library/await-async-queries */
import React, { RefObject } from 'react';
import { MemoryRouter, Router } from 'react-router-dom';
import { checkAccessibility, render, screen, waitFor } from '~/testUtils';

import { createBrowserHistory } from 'history';
import { ClusterTabsId } from '../../common/ClusterTabIds';
import TabsRow, { TabsRowProps } from '../TabsRow';

const tabNames = {
  overview: 'Overview',
  monitoring: 'Monitoring',
  accesscontrol: 'Access control',
  addons: 'Add-ons',
  clusterhistory: 'Cluster history',
  networking: 'Networking',
  machinepools: 'Machine pools',
  support: 'Support',
  settings: 'Settings',
  addhosts: 'Add Hosts',
};

describe('<TabsRow />', () => {
  const history = createBrowserHistory();
  const mockRef: RefObject<any> = { current: { hidden: true } };
  const onTabSelectedMock = jest.fn();

  const props: TabsRowProps = {
    tabsInfo: {
      overview: { ref: mockRef, hasIssues: false },
      monitoring: { ref: mockRef },
      accessControl: { ref: mockRef },
      addOns: { ref: mockRef },
      clusterHistory: { ref: mockRef },
      networking: { ref: mockRef },
      machinePools: { ref: mockRef },
      support: { ref: mockRef },
      upgradeSettings: { ref: mockRef },
      addAssisted: { ref: mockRef },
    },
    onTabSelected: onTabSelectedMock,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('display mechanism', () => {
    it.skip('is accessible', async () => {
      // This throws an error because the tabs are not tied to the content in this component.
      // Arrange
      const tabProps = { ...props, displayAccessControlTab: true, displayAddOnsTab: true };
      const { container } = render(
        <MemoryRouter
          keyLength={0}
          initialEntries={[{ pathname: '/details/s/:id', key: 'testKey' }]}
        >
          <TabsRow {...tabProps} />
        </MemoryRouter>,
      );

      // Assert
      await checkAccessibility(container);
    });

    it('shows all tabs', () => {
      // Arrange
      const tabProps: TabsRowProps = {
        ...props,
        tabsInfo: {
          overview: { ...props.tabsInfo.overview, show: true },
          monitoring: { ...props.tabsInfo.monitoring, show: true },
          accessControl: { ...props.tabsInfo.accessControl, show: true },
          addOns: { ...props.tabsInfo.addOns, show: true },
          clusterHistory: { ...props.tabsInfo.clusterHistory, show: true },
          networking: { ...props.tabsInfo.networking, show: true },
          machinePools: { ...props.tabsInfo.machinePools, show: true },
          support: { ...props.tabsInfo.support, show: true },
          upgradeSettings: { ...props.tabsInfo.upgradeSettings, show: true },
          addAssisted: { ...props.tabsInfo.addAssisted, show: true },
        },
      };

      // Act
      render(
        <MemoryRouter
          keyLength={0}
          initialEntries={[{ pathname: '/details/s/:id', key: 'testKey' }]}
        >
          <TabsRow {...tabProps} />
        </MemoryRouter>,
      );

      // Assert
      expect(screen.getAllByRole('tab')).toHaveLength(Object.keys(tabNames).length);

      expect(
        screen.getByRole('tab', { name: tabNames.overview, selected: true }),
      ).toBeInTheDocument();

      Object.values(tabNames)
        .filter((tabName) => tabName !== tabNames.overview)
        .forEach((tabName) =>
          expect(screen.getByRole('tab', { name: tabName, selected: false })).toBeInTheDocument(),
        );
    });

    it('shows all tabs. Add Host disabled', () => {
      // Arrange
      const tabProps: TabsRowProps = {
        ...props,
        tabsInfo: {
          overview: { ...props.tabsInfo.overview, show: true },
          monitoring: { ...props.tabsInfo.monitoring, show: true },
          accessControl: { ...props.tabsInfo.accessControl, show: true },
          addOns: { ...props.tabsInfo.addOns, show: true },
          clusterHistory: { ...props.tabsInfo.clusterHistory, show: true },
          networking: { ...props.tabsInfo.networking, show: true },
          machinePools: { ...props.tabsInfo.machinePools, show: true },
          support: { ...props.tabsInfo.support, show: true },
          upgradeSettings: { ...props.tabsInfo.upgradeSettings, show: true },
          addAssisted: { ...props.tabsInfo.addAssisted, show: true, isDisabled: true },
        },
      };

      // Act
      render(
        <MemoryRouter
          keyLength={0}
          initialEntries={[{ pathname: '/details/s/:id', key: 'testKey' }]}
        >
          <TabsRow {...tabProps} />
        </MemoryRouter>,
      );

      // Assert
      expect(screen.getAllByRole('tab')).toHaveLength(Object.keys(tabNames).length);

      expect(
        screen.getByRole('tab', { name: tabNames.overview, selected: true }),
      ).toBeInTheDocument();

      Object.values(tabNames)
        .filter((tabName) => tabName !== tabNames.overview)
        .forEach((tabName) =>
          expect(screen.getByRole('tab', { name: tabName, selected: false })).toBeInTheDocument(),
        );
    });

    it('shows just default tab', () => {
      // Arrange
      const tabProps = {
        ...props,
      };

      // Act
      render(
        <MemoryRouter
          keyLength={0}
          initialEntries={[{ pathname: '/details/s/:id', key: 'testKey' }]}
        >
          <TabsRow {...tabProps} />
        </MemoryRouter>,
      );

      // Assert
      expect(screen.getAllByRole('tab')).toHaveLength(2);
      expect(
        screen.getByRole('tab', { name: tabNames.overview, selected: true }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('tab', { name: tabNames.monitoring, selected: false }),
      ).toBeInTheDocument();

      Object.values(tabNames)
        .filter((tabName) => ![tabNames.overview, tabNames.monitoring].includes(tabName))
        .forEach((tabName) =>
          expect(screen.queryByRole('tab', { name: tabName })).not.toBeInTheDocument(),
        );
    });

    it('shows just overview tab', () => {
      // Arrange
      const tabProps: TabsRowProps = {
        ...props,
        tabsInfo: {
          ...props.tabsInfo,
          overview: { ...props.tabsInfo.overview, show: true },
          monitoring: { ...props.tabsInfo.monitoring, show: false },
        },
      };

      // Act
      render(
        <MemoryRouter
          keyLength={0}
          initialEntries={[{ pathname: '/details/s/:id', key: 'testKey' }]}
        >
          <TabsRow {...tabProps} />
        </MemoryRouter>,
      );

      // Assert
      expect(screen.getAllByRole('tab')).toHaveLength(1);

      expect(
        screen.getByRole('tab', { name: tabNames.overview, selected: true }),
      ).toBeInTheDocument();

      Object.values(tabNames)
        .filter((tabName) => tabName !== tabNames.overview)
        .forEach((tabName) =>
          expect(screen.queryByRole('tab', { name: tabName })).not.toBeInTheDocument(),
        );
    });

    it('shows monitoring tab with issues icon when hasIssues prop is passed', () => {
      // Arrange
      const tabProps: TabsRowProps = {
        ...props,
        tabsInfo: {
          ...props.tabsInfo,
          overview: { ...props.tabsInfo.overview, show: true },
          monitoring: { ...props.tabsInfo.monitoring, hasIssues: true },
        },
      };

      // Act
      render(
        <MemoryRouter
          keyLength={0}
          initialEntries={[{ pathname: '/details/s/:id', key: 'testKey' }]}
        >
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

  describe('init tab mechanism', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('selects tab which is displayed and not disabled', async () => {
      // Arrange
      const tabProps: TabsRowProps = {
        ...props,
        tabsInfo: {
          ...props.tabsInfo,
          overview: { ...props.tabsInfo.overview, show: true },
          clusterHistory: { ...props.tabsInfo.clusterHistory, show: true },
        },
        initTabOpen: ClusterTabsId.CLUSTER_HISTORY,
      };

      // Act
      render(
        <MemoryRouter
          keyLength={0}
          initialEntries={[{ pathname: '/details/s/:id', key: 'testKey' }]}
        >
          <TabsRow {...tabProps} />
        </MemoryRouter>,
      );

      // Assert
      await waitFor(() =>
        expect(
          screen.getByRole('tab', { name: tabNames.clusterhistory, selected: true }),
        ).toBeInTheDocument(),
      );
      expect(onTabSelectedMock).toHaveBeenCalledWith(ClusterTabsId.CLUSTER_HISTORY);
      expect(onTabSelectedMock).toHaveBeenCalledTimes(1);
    });

    it('selects tab which is not displayed', async () => {
      // Arrange
      const tabProps: TabsRowProps = {
        ...props,
        initTabOpen: ClusterTabsId.CLUSTER_HISTORY,
      };

      // Act
      render(
        <MemoryRouter
          keyLength={0}
          initialEntries={[{ pathname: '/details/s/:id', key: 'testKey' }]}
        >
          <TabsRow {...tabProps} />
        </MemoryRouter>,
      );

      // Assert
      expect(onTabSelectedMock).toHaveBeenCalledWith(ClusterTabsId.OVERVIEW);
      expect(onTabSelectedMock).toHaveBeenCalledTimes(2);
    });

    it('selects tab which is displayed but disabled', async () => {
      // Arrange
      const tabProps: TabsRowProps = {
        ...props,
        tabsInfo: {
          ...props.tabsInfo,
          addAssisted: { ...props.tabsInfo.addAssisted, show: true, isDisabled: true },
        },
        initTabOpen: ClusterTabsId.ADD_ASSISTED_HOSTS,
      };

      // Act
      render(
        <MemoryRouter
          keyLength={0}
          initialEntries={[{ pathname: '/details/s/:id', key: 'testKey' }]}
        >
          <TabsRow {...tabProps} />
        </MemoryRouter>,
      );

      // Assert
      expect(onTabSelectedMock).toHaveBeenCalledWith(ClusterTabsId.OVERVIEW);
      expect(onTabSelectedMock).toHaveBeenCalledTimes(2);
    });
  });

  describe('history mechanism', () => {
    it('navigates to show tab', async () => {
      // Arrange
      const tabProps: TabsRowProps = {
        ...props,
        tabsInfo: {
          ...props.tabsInfo,
          accessControl: { ...props.tabsInfo.accessControl, show: true },
          clusterHistory: { ...props.tabsInfo.clusterHistory, show: true },
        },
        initTabOpen: ClusterTabsId.ACCESS_CONTROL,
      };

      render(
        <Router history={history}>
          <TabsRow {...tabProps} />
        </Router>,
      );
      await waitFor(() => {
        history.push(`/details/s/testKey#${ClusterTabsId.ACCESS_CONTROL}`);
        expect(
          screen.getByRole('tab', { name: tabNames.accesscontrol, selected: true }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole('tab', { name: tabNames.clusterhistory, selected: false }),
        ).toBeInTheDocument();
      });

      // Act
      await waitFor(() => {
        history.push(`/details/s/testKey#${ClusterTabsId.CLUSTER_HISTORY}`);
      });

      // Assert
      await waitFor(() => {
        expect(onTabSelectedMock).toHaveBeenCalledTimes(3);
        expect(onTabSelectedMock).toHaveBeenCalledWith(ClusterTabsId.CLUSTER_HISTORY);

        expect(
          screen.getByRole('tab', { name: tabNames.clusterhistory, selected: true }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole('tab', { name: tabNames.accesscontrol, selected: false }),
        ).toBeInTheDocument();
      });
    });

    it('navigates to not shown tab', async () => {
      // Arrange
      const tabProps: TabsRowProps = {
        ...props,
        tabsInfo: {
          ...props.tabsInfo,
          accessControl: { ...props.tabsInfo.accessControl, show: true },
          clusterHistory: { ...props.tabsInfo.clusterHistory, show: false },
        },
        initTabOpen: ClusterTabsId.ACCESS_CONTROL,
      };

      render(
        <Router history={history}>
          <TabsRow {...tabProps} />
        </Router>,
      );

      await waitFor(() => {
        history.push(`/details/s/testKey#${ClusterTabsId.ACCESS_CONTROL}`);
        expect(
          screen.getByRole('tab', { name: tabNames.accesscontrol, selected: true }),
        ).toBeInTheDocument();
      });

      // Act
      await waitFor(() => {
        history.push(`/details/s/testKey#${ClusterTabsId.CLUSTER_HISTORY}`);
      });

      // Assert
      await waitFor(() => {
        expect(onTabSelectedMock).toHaveBeenCalledTimes(3);
        expect(onTabSelectedMock).toHaveBeenCalledWith(ClusterTabsId.OVERVIEW);

        expect(
          screen.getByRole('tab', { name: tabNames.overview, selected: true }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole('tab', { name: tabNames.accesscontrol, selected: false }),
        ).toBeInTheDocument();
      });
    });

    it('navigates to disabled tab', async () => {
      // Arrange
      const tabProps: TabsRowProps = {
        ...props,
        tabsInfo: {
          ...props.tabsInfo,
          accessControl: { ...props.tabsInfo.accessControl, show: true },
          addAssisted: { ...props.tabsInfo.addAssisted, show: true, isDisabled: true },
        },
        initTabOpen: ClusterTabsId.ACCESS_CONTROL,
      };

      render(
        <Router history={history}>
          <TabsRow {...tabProps} />
        </Router>,
      );

      await waitFor(() => {
        history.push(`/details/s/testKey#${ClusterTabsId.ACCESS_CONTROL}`);
        expect(
          screen.getByRole('tab', { name: tabNames.accesscontrol, selected: true }),
        ).toBeInTheDocument();
      });

      // Act
      await waitFor(() => {
        history.push(`/details/s/testKey#${ClusterTabsId.ADD_ASSISTED_HOSTS}`);
      });

      // Assert
      await waitFor(() => {
        expect(onTabSelectedMock).toHaveBeenCalledTimes(3);
        expect(onTabSelectedMock).toHaveBeenCalledWith(ClusterTabsId.OVERVIEW);

        expect(
          screen.getByRole('tab', { name: tabNames.overview, selected: true }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole('tab', { name: tabNames.accesscontrol, selected: false }),
        ).toBeInTheDocument();
      });
    });

    it('navigates to undefined tab', async () => {
      // Arrange
      const tabProps: TabsRowProps = {
        ...props,
        tabsInfo: {
          ...props.tabsInfo,
          accessControl: { ...props.tabsInfo.accessControl, show: true },
          addAssisted: { ...props.tabsInfo.addAssisted, show: true, isDisabled: true },
        },
        initTabOpen: ClusterTabsId.ACCESS_CONTROL,
      };

      render(
        <Router history={history}>
          <TabsRow {...tabProps} />
        </Router>,
      );

      await waitFor(() => {
        history.push(`/details/s/testKey#${ClusterTabsId.ACCESS_CONTROL}`);
        expect(
          screen.getByRole('tab', { name: tabNames.accesscontrol, selected: true }),
        ).toBeInTheDocument();
      });

      // Act
      await waitFor(() => history.push('/details/s/testKey#whatever'));

      // Assert
      await waitFor(() => {
        expect(onTabSelectedMock).toHaveBeenCalledTimes(3);
        expect(onTabSelectedMock).toHaveBeenCalledWith(ClusterTabsId.OVERVIEW);
        expect(
          screen.getByRole('tab', { name: tabNames.overview, selected: true }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole('tab', { name: tabNames.accesscontrol, selected: false }),
        ).toBeInTheDocument();
      });
    });
  });
});
