import React from 'react';
import { screen, render, axe, within } from '~/testUtils';
import DetailsLeft from './DetailsLeft';
import fixtures from '../../__test__/ClusterDetails.fixtures';

const defaultProps = {
  cluster: fixtures.clusterDetails.cluster,
  cloudProviders: fixtures.cloudProviders,
};

const componentText = {
  CONTROL_PLANE: { label: 'Control plane type', hosted: 'Hosted' },
  AVAILABILITY: { label: 'Availability', multi: 'Multi-zone', single: 'Single zone' },
  REGION: { label: 'Region', NA: 'N/A' },
  PROVIDER: { label: 'Provider', NA: 'N/A' },
  ID: { label: 'Cluster ID', aiLabel: 'Assisted cluster ID / Cluster ID', NA: 'N/A' },
  VERSION: { label: 'Version' },
  OWNER: { label: 'Owner', NA: 'N/A' },
  SUBSCRIPTION: { label: 'Subscription type' },
  INFRASTRUCTURE: { label: 'Infrastructure type' },
};

const checkForValue = (label, value) => {
  expect(screen.getByText(label)).toBeInTheDocument();
  if (value) {
    expect(screen.getByText(value)).toBeInTheDocument();

    // Verify that the value is below the label
    // Cannot use roles of "term" and "definition" because there are children elements
    const labelObj = screen.getByText(label);
    expect(labelObj.closest('div').querySelector('dd')).toHaveTextContent(value);
  }
};

const checkForValueAbsence = (label, value) => {
  expect(screen.queryByText(label)).not.toBeInTheDocument();
  if (value) {
    expect(screen.queryByText(value)).not.toBeInTheDocument();
  }
};

global.insights = {
  chrome: {
    on: () => () => {},
    auth: {
      getUser: () => Promise.resolve({ data: {} }),
      getToken: () => Promise.resolve(),
    },
  },
};

describe('<DetailsLeft />', () => {
  it('is accessible', async () => {
    // Arrange
    const OSDClusterFixture = fixtures.clusterDetails.cluster;

    const props = { ...defaultProps, cluster: OSDClusterFixture };
    const { container } = render(<DetailsLeft {...props} />);

    // Assert
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  describe('Cluster id', () => {
    it('shows cluster ID for a non assisted installer cluster', () => {
      // Arrange
      const OSDClusterFixture = fixtures.clusterDetails.cluster;

      const props = { ...defaultProps, cluster: OSDClusterFixture };
      render(<DetailsLeft {...props} />);

      // Assert
      checkForValue(componentText.ID.label, 'bae5b227-2472-4e71-be4d-a18fc60bb48a');
    });

    it('shows assisted installer id for assisted installer cluster', () => {
      // Arrange
      const AIClusterFixture = fixtures.AIClusterDetails.cluster;

      const props = { ...defaultProps, cluster: AIClusterFixture, showAssistedId: true };
      render(<DetailsLeft {...props} />);

      // Assert
      checkForValue(
        componentText.ID.aiLabel,
        '1i4counta3holamvo1g5tp6n8p3a03bq / bae5b227-2472-4e71-be4d-a18fc60bb48a',
      );
    });

    it('shows "NA" when cluster id is not known', () => {
      // Arrange
      const OSDClusterFixture = { ...fixtures.clusterDetails.cluster, external_id: undefined };

      const props = { ...defaultProps, cluster: OSDClusterFixture };
      render(<DetailsLeft {...props} />);

      // Assert
      checkForValue(componentText.ID.label, componentText.ID.NA);
    });

    it('shows "NA" when id is not know for an assisted installer cluster', () => {
      // Arrange
      const AIClusterFixture = { ...fixtures.AIClusterDetails.cluster, aiCluster: {} };

      const props = { ...defaultProps, cluster: AIClusterFixture, showAssistedId: true };
      render(<DetailsLeft {...props} />);

      // Assert
      checkForValue(
        componentText.ID.aiLabel,
        `${componentText.ID.NA} / bae5b227-2472-4e71-be4d-a18fc60bb48a`,
      );
    });
  });

  describe('Control plane', () => {
    it('shows control plane type as Hosted if hypershift', () => {
      // Arrange
      const ROSAHypershiftClusterFixture = fixtures.ROSAHypershiftClusterDetails.cluster;
      expect(ROSAHypershiftClusterFixture.hypershift.enabled).toBeTruthy();

      const props = { ...defaultProps, cluster: ROSAHypershiftClusterFixture };
      render(<DetailsLeft {...props} />);

      // Assert
      checkForValue(componentText.CONTROL_PLANE.label, componentText.CONTROL_PLANE.hosted);
    });

    it('hides control plane type if not hypershift', () => {
      // Arrange
      const OSDClusterFixture = fixtures.clusterDetails.cluster;
      expect(OSDClusterFixture.hypershift?.enabled).toBeFalsy();

      const props = { ...defaultProps, cluster: OSDClusterFixture };
      render(<DetailsLeft {...props} />);

      // Assert
      checkForValueAbsence(componentText.CONTROL_PLANE.label, componentText.CONTROL_PLANE.hosted);
    });
  });

  describe('Region', () => {
    it('show region', () => {
      // Arrange
      const OSDClusterFixture = fixtures.clusterDetails.cluster;

      const props = { ...defaultProps, cluster: OSDClusterFixture };
      render(<DetailsLeft {...props} />);

      // Assert
      checkForValue(componentText.REGION.label, 'us-east-1');
    });

    it('show "N/A" for region, if region is not set', () => {
      // Arrange
      const OSDClusterNoRegionFixture = { ...fixtures.clusterDetails.cluster, region: {} };

      const props = { ...defaultProps, cluster: OSDClusterNoRegionFixture };
      render(<DetailsLeft {...props} />);

      // Assert
      checkForValue(componentText.REGION.label, componentText.REGION.NA);
    });
  });

  describe('Cloud provider', () => {
    it('show "NA" if cluster does not have a cloud provider id', () => {
      // Arrange
      const NoProviderClusterFixture = {
        ...fixtures.clusterDetails.cluster,
        cloud_provider: undefined,
      };

      const props = { ...defaultProps, cluster: NoProviderClusterFixture };
      render(<DetailsLeft {...props} />);

      // Assert
      checkForValue(componentText.PROVIDER.label, componentText.PROVIDER.NA);
    });

    it('shows cloud provider id as uppercase if cloud providers has not loaded', () => {
      // Arrange
      const ClusterFixture = {
        ...fixtures.clusterDetails.cluster,
      };

      expect(ClusterFixture.cloud_provider.id).toEqual('aws');

      const props = {
        ...defaultProps,
        cluster: ClusterFixture,
        cloudProviders: { ...fixtures.cloudProviders, fulfilled: false },
      };
      render(<DetailsLeft {...props} />);

      // Assert
      checkForValue(componentText.PROVIDER.label, 'AWS');
    });

    it('shows cloud provider id as uppercase if cloud provider is not known by the application', () => {
      // Arrange
      const ClusterFixture = {
        ...fixtures.clusterDetails.cluster,
        cloud_provider: { id: 'mynewprovider' },
      };

      expect(fixtures.cloudProviders.mynewprovider).toBeUndefined();

      const props = {
        ...defaultProps,
        cluster: ClusterFixture,
      };
      render(<DetailsLeft {...props} />);

      // Assert
      checkForValue(componentText.PROVIDER.label, 'MYNEWPROVIDER');
    });

    it('shows NA if the cloud provider is known but does not have a display name', () => {
      // Arrange
      const ClusterFixture = {
        ...fixtures.clusterDetails.cluster,
        cloud_provider: { id: 'rain' },
      };

      const ProviderFixture = { ...fixtures.cloudProviders };
      ProviderFixture.providers.rain = { kind: 'CloudProvider', id: 'rain' };

      const props = {
        ...defaultProps,
        cluster: ClusterFixture,
        cloudProviders: ProviderFixture,
      };
      render(<DetailsLeft {...props} />);

      // Assert
      checkForValue(componentText.PROVIDER.label, componentText.PROVIDER.NA);
    });

    it('hides cloud provider if a ROSA cluster', () => {
      // Arrange
      const ROSAClusterFixture = fixtures.ROSAClusterDetails.cluster;

      const props = { ...defaultProps, cluster: ROSAClusterFixture };
      render(<DetailsLeft {...props} />);

      // Assert
      checkForValueAbsence(componentText.PROVIDER.label);
    });

    it('hides cloud provider if ROSA Hypershift', () => {
      // Arrange
      const ROSAHypershiftClusterFixture = fixtures.ROSAHypershiftClusterDetails.cluster;

      const props = { ...defaultProps, cluster: ROSAHypershiftClusterFixture };
      render(<DetailsLeft {...props} />);

      // Assert
      checkForValueAbsence(componentText.PROVIDER.label);
    });
  });

  describe('Availability', () => {
    it('hides availability if not managed', () => {
      // Arrange
      const ROSAClusterFixture = { ...fixtures.ROSAClusterDetails.cluster, managed: false };

      const props = { ...defaultProps, cluster: ROSAClusterFixture };
      render(<DetailsLeft {...props} />);

      // Assert
      checkForValueAbsence(componentText.AVAILABILITY.label);
    });

    it('shows availability as "Multi-zone" if multi-zone cluster that is not hypershift', () => {
      // Arrange
      const ROSAClusterFixture = {
        ...fixtures.ROSAClusterDetails.cluster,
        managed: true,
        multi_az: true,
      };
      expect(ROSAClusterFixture.hypershift?.enabled).toBeFalsy();

      const props = { ...defaultProps, cluster: ROSAClusterFixture };
      render(<DetailsLeft {...props} />);

      // Assert
      checkForValue(componentText.AVAILABILITY.label, componentText.AVAILABILITY.multi);
    });

    it('shows availability as "Single zone" if non-multi-zone cluster that is not hypershift', () => {
      // Arrange
      const ROSAClusterFixture = {
        ...fixtures.ROSAClusterDetails.cluster,
        managed: true,
        multi_az: false,
      };
      expect(ROSAClusterFixture.hypershift?.enabled).toBeFalsy();

      const props = { ...defaultProps, cluster: ROSAClusterFixture };
      render(<DetailsLeft {...props} />);

      // Assert
      checkForValue(componentText.AVAILABILITY.label, componentText.AVAILABILITY.single);
    });

    it('shows Multi-Zone for Hypershift cluster ', () => {
      // NOTE: This tests that the UI shows multi-zone regardless of value

      // Arrange
      const ROSAHypershiftClusterFixture = {
        ...fixtures.ROSAHypershiftClusterDetails.cluster,
        multi_az: true,
      };
      expect(ROSAHypershiftClusterFixture.hypershift.enabled).toBeTruthy();
      expect(ROSAHypershiftClusterFixture.multi_az).toBe(true);

      const props = { ...defaultProps, cluster: ROSAHypershiftClusterFixture };
      render(<DetailsLeft {...props} />);

      // Assert
      checkForValue(componentText.AVAILABILITY.label, componentText.AVAILABILITY.multi);
    });
  });

  describe('Version popover', () => {
    it('shows version popover hint for Hypershift', () => {
      // Arrange
      const ROSAHypershiftClusterFixture = fixtures.ROSAHypershiftClusterDetails.cluster;
      expect(ROSAHypershiftClusterFixture.hypershift.enabled).toBeTruthy();

      const props = { ...defaultProps, cluster: ROSAHypershiftClusterFixture };
      render(<DetailsLeft {...props} />);

      // Assert
      expect(
        within(screen.getByText(componentText.VERSION.label)).getByRole('button', {
          name: 'More information',
        }),
      ).toBeInTheDocument();
    });

    it('hides version popover hint for non-hypershift', () => {
      // Arrange
      const OSDClusterFixture = fixtures.clusterDetails.cluster;
      expect(OSDClusterFixture.hypershift?.enabled).toBeFalsy();

      const props = { ...defaultProps, cluster: OSDClusterFixture };
      render(<DetailsLeft {...props} />);

      // Assert
      expect(
        within(screen.getByText(componentText.VERSION.label)).queryByRole('button', {
          name: 'More information',
        }),
      ).not.toBeInTheDocument();
    });
  });

  describe('Owner', () => {
    it('shows creator name as the owner', () => {
      // Arrange
      const OSDClusterFixture = {
        ...fixtures.clusterDetails.cluster,
        subscription: {
          ...fixtures.clusterDetails.cluster.subscription,
          creator: { name: 'creator name' },
        },
      };

      const props = { ...defaultProps, cluster: OSDClusterFixture };
      render(<DetailsLeft {...props} />);

      // Assert
      checkForValue(componentText.OWNER.label, 'creator name');
    });

    it('shows creator username if name is not available as owner ', () => {
      // Arrange
      const OSDClusterFixture = {
        ...fixtures.clusterDetails.cluster,
        subscription: {
          ...fixtures.clusterDetails.cluster.subscription,
          creator: { username: 'creator username', name: undefined },
        },
      };

      const props = { ...defaultProps, cluster: OSDClusterFixture };
      render(<DetailsLeft {...props} />);

      // Assert
      checkForValue(componentText.OWNER.label, 'creator username');
    });

    it('shows "N/A" as the owner if creator name and creator username are not available', () => {
      // Arrange
      const OSDClusterFixture = {
        ...fixtures.clusterDetails.cluster,
        subscription: {
          ...fixtures.clusterDetails.cluster.subscription,
          creator: { username: undefined, name: undefined },
        },
      };

      const props = { ...defaultProps, cluster: OSDClusterFixture };
      render(<DetailsLeft {...props} />);

      // Assert
      checkForValue(componentText.OWNER.label, componentText.OWNER.NA);

      // type
    });
  });

  describe('subscription and infrastructure headings', () => {
    it('shows subscription type and infrastructure headings if managed and not ROSA', () => {
      // Arrange
      const OSDClusterFixture = {
        ...fixtures.clusterDetails.cluster,
        managed: true,
      };

      const props = { ...defaultProps, cluster: OSDClusterFixture };
      render(<DetailsLeft {...props} />);

      // Assert
      checkForValue(componentText.SUBSCRIPTION.label);
      checkForValue(componentText.INFRASTRUCTURE.label);
    });

    it('hides subscription type and infrastructure headings if not managed', () => {
      // Arrange
      const OSDClusterFixture = {
        ...fixtures.clusterDetails.cluster,
        managed: false,
      };

      const props = { ...defaultProps, cluster: OSDClusterFixture };
      render(<DetailsLeft {...props} />);

      // Assert
      checkForValueAbsence(componentText.SUBSCRIPTION.label);
      checkForValueAbsence(componentText.INFRASTRUCTURE.label);
    });

    it('hides subscription type and infrastructure headings if ROSA', () => {
      // Arrange
      const ROSAClusterFixture = fixtures.ROSAClusterDetails.cluster;

      const props = { ...defaultProps, cluster: ROSAClusterFixture };
      render(<DetailsLeft {...props} />);

      // Assert
      checkForValueAbsence(componentText.SUBSCRIPTION.label);
      checkForValueAbsence(componentText.INFRASTRUCTURE.label);
    });

    it('hides subscription type and infrastructure headings if Hypershift', () => {
      // Arrange
      const ROSAHypershiftClusterFixture = fixtures.ROSAHypershiftClusterDetails.cluster;

      const props = { ...defaultProps, cluster: ROSAHypershiftClusterFixture };
      render(<DetailsLeft {...props} />);

      // Assert
      checkForValueAbsence(componentText.SUBSCRIPTION.label);
      checkForValueAbsence(componentText.INFRASTRUCTURE.label);
    });
  });
});
