import { Cluster } from '~/types/clusters_mgmt.v1';
import { isClusterUpgrading } from './clusterStates';
import getClusterVersion from './getClusterVersion';

jest.mock('./clusterStates');
const mockedIsClusterUpgrading = isClusterUpgrading as jest.Mock;

describe('get cluster version', () => {
  describe('cluster is upgrading', () => {
    beforeAll(() => {
      jest.clearAllMocks();
      mockedIsClusterUpgrading.mockReturnValue(true);
    });

    it('both cluster version and openshift are present on cluster object', () => {
      // Arrange
      const cluster: Cluster = {
        version: {
          raw_id: 'rawId',
        },
        openshift_version: 'openshiftVersion',
      };

      // Act
      const clusterVersion = getClusterVersion(cluster);

      // Assert
      expect(clusterVersion).toEqual('rawId');
    });

    it('cluster version is present but openshiftVersion on cluster object', () => {
      // Arrange
      const cluster: Cluster = {
        version: {
          raw_id: 'rawId',
        },
      };

      // Act
      const clusterVersion = getClusterVersion(cluster);

      // Assert
      expect(clusterVersion).toEqual('rawId');
    });

    it('cluster version is not present but openshift version on cluster object', () => {
      // Arrange
      const cluster: Cluster = {
        openshift_version: 'openshiftVersion',
      };

      // Act
      const clusterVersion = getClusterVersion(cluster);

      // Assert
      expect(clusterVersion).toEqual('N/A');
    });

    it('neither cluster version or openshift version are present on cluster object', () => {
      // Act
      const clusterVersion = getClusterVersion({});

      // Assert
      expect(clusterVersion).toEqual('N/A');
    });
  });

  describe('cluster is not upgrading', () => {
    beforeAll(() => {
      jest.clearAllMocks();
      mockedIsClusterUpgrading.mockReturnValue(false);
    });

    it('both cluster version and openshift are present on cluster object', () => {
      // Arrange
      const cluster: Cluster = {
        version: {
          raw_id: 'rawId',
        },
        openshift_version: 'openshiftVersion',
      };

      // Act
      const clusterVersion = getClusterVersion(cluster);

      // Assert
      expect(clusterVersion).toEqual('openshiftVersion');
    });

    it('cluster version is present but openshiftVersion on cluster object', () => {
      // Arrange
      const cluster: Cluster = {
        version: {
          raw_id: 'rawId',
        },
      };

      // Act
      const clusterVersion = getClusterVersion(cluster);

      // Assert
      expect(clusterVersion).toEqual('rawId');
    });

    it('cluster version is not present but openshift version on cluster object', () => {
      // Arrange
      const cluster: Cluster = {
        openshift_version: 'openshiftVersion',
      };

      // Act
      const clusterVersion = getClusterVersion(cluster);

      // Assert
      expect(clusterVersion).toEqual('openshiftVersion');
    });

    it('neither cluster version or openshift version are present on cluster object', () => {
      // Act
      const clusterVersion = getClusterVersion({});

      // Assert
      expect(clusterVersion).toEqual('N/A');
    });
  });
});
