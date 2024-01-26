/* eslint-disable testing-library/no-unnecessary-act */
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { mockRestrictedEnv, render, screen, waitFor } from '../../../../testUtils';
import clusterStates from '../../common/clusterStates';
import ClusterDetails from '../ClusterDetails';
import fixtures, { funcs } from './ClusterDetails.fixtures';

jest.mock('../components/UpgradeSettings/UpgradeSettingsTab', () => () => <div />);
// to avoid "React does not recognize the `isDisabled` prop on a DOM element" warning
// eslint-disable-next-line react/prop-types
jest.mock('../components/Support', () => ({ isDisabled, ...props }) => (
  <div disabled={isDisabled} {...props} />
));
jest.mock('../components/ClusterLogs/ClusterLogs', () => () => <div />);
jest.mock('../components/AccessControl/AccessControl', () => () => <div />);
jest.mock('../components/Support/components/AddNotificationContactDialog', () => (props) => (
  <div {...props} />
));
describe('<ClusterDetails />', () => {
  // eslint-disable-next-line react/prop-types
  const RouterWrapper = ({ children }) => (
    <MemoryRouter keyLength={0} initialEntries={[{ pathname: '/details/s/:id', key: 'testKey' }]}>
      {children}
    </MemoryRouter>
  );

  describe('hypershift cluster', () => {
    const functions = funcs();
    const props = {
      ...fixtures,
      ...functions,
      clusterDetails: {
        ...fixtures.ROSAClusterDetails,
        cluster: {
          ...fixtures.ROSAClusterDetails.cluster,
          hypershift: { enabled: true },
        },
      },
    };

    it('should get node pools', async () => {
      // Act
      render(
        <RouterWrapper>
          <ClusterDetails {...props} />
        </RouterWrapper>,
      );

      // Assert
      await waitFor(() => {
        expect(functions.getMachineOrNodePools).toBeCalledWith(
          fixtures.ROSAClusterDetails.cluster.id,
          true,
          'openshift-v4.6.8',
          undefined,
        );
      });
    });

    it('displays the network tab if private link is true', async () => {
      // Arrange
      const cluster = {
        state: clusterStates.READY,
        managed: true,
        cloud_provider: { id: 'aws' },
        ccs: { enabled: true },
        hypershift: { enabled: true },
        aws: { private_link: true },
      };

      const functions = funcs();
      const props = {
        ...fixtures,
        ...functions,
        clearFiltersAndFlags: () => {},
        clusterDetails: {
          ...fixtures.ROSAClusterDetails,
          cluster: { ...fixtures.ROSAClusterDetails.cluster, cluster },
        },
      };

      // Act
      render(
        <RouterWrapper>
          <ClusterDetails {...props} />
        </RouterWrapper>,
      );

      // Assert
      await waitFor(() => {
        expect(screen.getByRole('tab', { name: 'Networking' })).toBeInTheDocument();
      });
    });

    it('displays the network tab if private link is false', async () => {
      // Arrange
      const cluster = {
        state: clusterStates.READY,
        managed: true,
        cloud_provider: { id: 'aws' },
        ccs: { enabled: true },
        hypershift: { enabled: true },
        aws: { private_link: false },
      };

      const functions = funcs();
      const props = {
        ...fixtures,
        ...functions,
        clearFiltersAndFlags: () => {},
        clusterDetails: {
          ...fixtures.ROSAClusterDetails,
          cluster: { ...fixtures.ROSAClusterDetails.cluster, cluster },
        },
      };

      // Act
      render(
        <RouterWrapper>
          <ClusterDetails {...props} />
        </RouterWrapper>,
      );

      // Assert
      await waitFor(() => {
        expect(screen.getByRole('tab', { name: 'Networking' })).toBeInTheDocument();
      });
    });
  });

  describe('Restricted env details', () => {
    const isRestrictedEnv = mockRestrictedEnv();

    beforeEach(() => {
      isRestrictedEnv.mockReturnValue(true);
    });

    afterEach(() => {
      isRestrictedEnv.mockReturnValue(false);
    });

    it('hides tabs in restricted env', async () => {
      // Arrange
      const functions = funcs();
      const props = {
        ...fixtures,
        ...functions,
        clearFiltersAndFlags: () => {},
        clusterDetails: {
          ...fixtures.ROSAClusterDetails,
          cluster: {
            ...fixtures.ROSAClusterDetails.cluster,
            hypershift: { enabled: true },
            canEdit: true,
          },
        },
        isAROCluster: false,
        isArchived: false,
        displayClusterLogs: true,
      };

      // Act
      render(
        <RouterWrapper>
          <ClusterDetails {...props} />
        </RouterWrapper>,
      );

      // Assert
      await waitFor(() => {
        expect(screen.queryByRole('tab', { name: 'Monitoring' })).not.toBeInTheDocument();
      });

      expect(screen.queryByRole('tab', { name: 'Add-ons' })).not.toBeInTheDocument();

      expect(screen.queryByRole('tab', { name: 'Support' })).toBeInTheDocument();
      expect(screen.queryByRole('tab', { name: 'Settings' })).toBeInTheDocument();
      expect(screen.queryByRole('tab', { name: 'Cluster history' })).toBeInTheDocument();
      expect(screen.queryByRole('tab', { name: 'Access control' })).toBeInTheDocument();
      expect(screen.queryByRole('tab', { name: 'Networking' })).toBeInTheDocument();
      expect(screen.queryByRole('tab', { name: 'Machine pools' })).toBeInTheDocument();
      expect(screen.queryByRole('tab', { name: 'Overview' })).toBeInTheDocument();
    });
  });
});
