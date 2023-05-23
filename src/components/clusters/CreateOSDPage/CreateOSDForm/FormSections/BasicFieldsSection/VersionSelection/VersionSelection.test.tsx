import React from 'react';
import { render, screen, userEvent, within, axe } from '@testUtils';
import * as ReleaseHooks from '~/components/releases/hooks';
import * as helpers from '~/common/helpers';
import VersionSelection from './VersionSelection';
import { ProductLifeCycle } from '~/types/product-life-cycles';

const useOCPLifeCycleStatusDataSpy = jest.spyOn(ReleaseHooks, 'useOCPLifeCycleStatusData');

const componentText = {
  // There is a PatternFly major bug that doesn't allow for the aria-label to be changed
  // ALL select drop downs will have an accessible label of "Options menu"
  BUTTON: { label: 'Options menu' },
};

const versions = [
  {
    ami_overrides: [],
    channel_group: 'stable',
    default: false,
    enabled: true,
    end_of_life_timestamp: '2024-03-17T00:00:00Z',
    hosted_control_plane_enabled: true,
    href: '/api/clusters_mgmt/v1/versions/openshift-v4.12.1',
    id: 'openshift-v4.12.1',
    kind: 'Version',
    raw_id: '4.12.1',
    release_image:
      'quay.io/openshift-release-dev/ocp-release@sha256:b9d6ccb5ba5a878141e468e56fa62912ad7c04864acfec0c0056d2b41e3259cc',
    rosa_enabled: true,
  },
  {
    ami_overrides: [],
    channel_group: 'stable',
    default: false,
    enabled: true,
    end_of_life_timestamp: '2024-03-17T00:00:00Z',
    hosted_control_plane_enabled: true,
    href: '/api/clusters_mgmt/v1/versions/openshift-v4.11.4',
    id: 'openshift-v4.11.4',
    kind: 'Version',
    raw_id: '4.11.4',
    release_image:
      'quay.io/openshift-release-dev/ocp-release@sha256:b9d6ccb5ba5a878141e468e56fa62912ad7c04864acfec0c0056d2b41e3259cc',
    rosa_enabled: true,
  },
  {
    ami_overrides: [],
    channel_group: 'stable',
    default: false,
    enabled: true,
    end_of_life_timestamp: '2024-03-17T00:00:00Z',
    hosted_control_plane_enabled: true,
    href: '/api/clusters_mgmt/v1/versions/openshift-v4.11.3',
    id: 'openshift-v4.11.3',
    kind: 'Version',
    raw_id: '4.11.3',
    release_image:
      'quay.io/openshift-release-dev/ocp-release@sha256:b9d6ccb5ba5a878141e468e56fa62912ad7c04864acfec0c0056d2b41e3259cc',
    rosa_enabled: true,
  },
  {
    ami_overrides: [],
    channel_group: 'stable',
    default: false,
    enabled: true,
    end_of_life_timestamp: '2024-03-17T00:00:00Z',
    hosted_control_plane_enabled: true,
    href: '/api/clusters_mgmt/v1/versions/openshift-v4.10.1',
    id: 'openshift-v4.10.1',
    kind: 'Version',
    raw_id: '4.10.1',
    release_image:
      'quay.io/openshift-release-dev/ocp-release@sha256:b9d6ccb5ba5a878141e468e56fa62912ad7c04864acfec0c0056d2b41e3259cc',
    rosa_enabled: true,
  },
];

const getInstallableVersionsResponse = {
  error: false,
  errorMessage: '',
  fulfilled: true,
  pending: false,
  valid: true,
  versions,
};

const defaultProps = {
  isOpen: true,
  isRosa: true,
  hasManagedArnsSelected: false,
  isHypershiftSelected: false,
  rosaMaxOSVersion: '4.12',
  input: { onChange: jest.fn() },
  isDisabled: false,
  label: 'Version select label',
  meta: { error: false, touched: false },
  getInstallableVersions: jest.fn(),
  getInstallableVersionsResponse,
  selectedClusterVersion: undefined,
};

describe('<VersionSelection />', () => {
  beforeAll(() => {
    useOCPLifeCycleStatusDataSpy.mockReturnValue(
      mockOCPLifeCycleStatusData as [ProductLifeCycle[] | undefined, boolean],
    );
  });

  it.skip('is accessible when open', async () => {
    // There are numerous accessibility issues including:
    // nested listboxes
    // improper nesting of items in a listbox (missing use of optgroup tag or role=group)
    // numerous items hidden from users with use of hidden or aria-hidden attributes
    // use of aria-label and aria-labeledby on the same component
    // multiple ids listed in the aria-labeledby attribute

    // Arrange
    const newProps = {
      ...defaultProps,
    };
    const { container } = render(<VersionSelection {...newProps} />);

    // Assert
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('is accessible when closed', async () => {
    // Arrange
    const newProps = {
      ...defaultProps,
      isOpen: false,
    };
    const { container } = render(<VersionSelection {...newProps} />);

    // Assert
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  describe('when Hypershfit', () => {
    it('hides versions prior to "4.11.4" when hypershift and an ARN with a managed policy are selected', () => {
      // Arrange
      const newProps = {
        ...defaultProps,
        hasManagedArnsSelected: true,
        isHypershiftSelected: true,
      };
      render(<VersionSelection {...newProps} />);

      // Assert
      expect(screen.getByRole('option', { name: '4.12.1' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: '4.11.4' })).toBeInTheDocument();
      expect(screen.queryByRole('option', { name: '4.11.3' })).not.toBeInTheDocument();
      expect(screen.queryByRole('option', { name: '4.10.1' })).not.toBeInTheDocument();
    });

    it('shows versions prior to "4.11.4" when hypershift is selected and no ARNs with managed policies are selected', () => {
      // Arrange
      const newProps = {
        ...defaultProps,
        hasManagedArnsSelected: false,
        isHypershiftSelected: true,
      };
      render(<VersionSelection {...newProps} />);

      // Assert
      versions.forEach((version) => {
        expect(screen.getByRole('option', { name: version.raw_id })).toBeInTheDocument();
      });
    });
  });

  describe('all clusters', () => {
    let mockedSupportedVersion: jest.SpyInstance<
      boolean,
      [version: string, maxMinorVersion: string]
    >;
    beforeEach(() => {
      mockedSupportedVersion = jest.spyOn(helpers, 'isSupportedMinorVersion');
    });
    afterEach(() => {
      mockedSupportedVersion.mockRestore();
    });
    it('displays only error when error getting versions', () => {
      // Arrange
      const newProps = {
        ...defaultProps,
        getInstallableVersionsResponse: {
          error: true,
          pending: false,
          errorMessage: 'This is a custom error message',
        },
      };
      render(<VersionSelection {...newProps} />);

      // Assert
      expect(
        within(screen.getByRole('alert')).getByText(/Error getting cluster versions/),
      ).toBeInTheDocument();
      expect(screen.getByText('This is a custom error message')).toBeInTheDocument();
      expect(screen.queryByLabelText(componentText.BUTTON.label)).not.toBeInTheDocument();
      expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
    });

    it('displays only error when a default ROSA version is not found', () => {
      // Arrange
      mockedSupportedVersion.mockImplementation(() => false);

      const newProps = {
        ...defaultProps,
        isRosa: true,
      };
      render(<VersionSelection {...newProps} />);

      // Assert
      expect(
        within(screen.getByRole('alert')).getByText(
          /There is no version compatible with the selected ARNs in previous step/,
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByText('There is no version compatible with the selected ARNs in previous step'),
      ).toBeInTheDocument();
      expect(screen.queryByLabelText(componentText.BUTTON.label)).not.toBeInTheDocument();
    });

    it('displays only spinner while retrieving versions', () => {
      // Arrange
      const newProps = {
        ...defaultProps,
        getInstallableVersionsResponse: {
          pending: true,
          fulfilled: false,
          error: false,
        },
      };
      render(<VersionSelection {...newProps} />);

      // Assert
      // There is no role associated with the loading icon
      expect(screen.getByText(/Loading/)).toBeInTheDocument();
      expect(screen.queryByLabelText(componentText.BUTTON.label)).not.toBeInTheDocument();
    });

    it('displays view compatible version switch if is ROSA and there are incompatible versions', () => {
      // Arrange
      const newProps = {
        ...defaultProps,
        isRosa: true,
        rosaMaxOSVersion: '4.11.3',
      };
      render(<VersionSelection {...newProps} />);

      // Assert
      expect(screen.getByLabelText('View only compatible versions')).toBeInTheDocument();
    });

    it('hides view compatible switch if not ROSA', () => {
      // Arrange
      const newProps = {
        ...defaultProps,
        isRosa: false,
        rosaMaxOSVersion: '4.11.3',
      };
      render(<VersionSelection {...newProps} />);

      // Assert
      expect(screen.queryByLabelText('View only compatible versions')).not.toBeInTheDocument();
    });

    it('hides view compatible switch if there are no incompatible versions', () => {
      // Arrange
      const newProps = {
        ...defaultProps,
        isRosa: true,
        rosaMaxOSVersion: '4.12.1',
      };
      render(<VersionSelection {...newProps} />);

      // Assert
      expect(screen.queryByLabelText('View only compatible versions')).not.toBeInTheDocument();
    });

    it('toggling view compatible switch hides/shows compatible versions', async () => {
      // Arrange
      const user = userEvent.setup();
      const newProps = {
        ...defaultProps,
        isRosa: true,
        rosaMaxOSVersion: '4.11.3',
      };
      render(<VersionSelection {...newProps} />);

      expect(screen.getByLabelText('View only compatible versions')).toBeInTheDocument();
      expect(screen.queryByRole('option', { name: '4.12.1' })).not.toBeInTheDocument();

      // Act
      await user.click(screen.getByLabelText('View only compatible versions'));

      // Assert
      expect(
        screen.getByRole('option', {
          name: '4.12.1 This version is not compatible with the selected ARNs in previous step',
        }),
      ).toBeInTheDocument();

      // Act
      await user.click(screen.getByLabelText('View only compatible versions'));

      // Assert
      expect(screen.queryByRole('option', { name: '4.12.1' })).not.toBeInTheDocument();
    });

    it('shows full support versions grouped together', () => {
      // The group heading "Full Support" is technically hidden by PatternFly
      // Would recommend moving away from the custom PF Select Group and move to using an optgroup tag

      // There are 3 listboxes - one that is the parent and two children corresponding to Full Support and Maintenance support
      // This is an accessibility issue (listboxes cannot be children of other listboxes)
      // Assuming the first child listbox is the Full Support list

      // Arrange
      render(<VersionSelection {...defaultProps} />);

      const inMainListBox = screen.getAllByRole('listbox')[0];

      expect(within(inMainListBox).getAllByRole('listbox')).toHaveLength(2);

      // Assert
      const fullSupportList = within(inMainListBox).getAllByRole('listbox')[0];
      expect(within(fullSupportList).getAllByRole('option')).toHaveLength(1);
      expect(within(fullSupportList).getByRole('option', { name: '4.12.1' })).toBeInTheDocument();
    });

    it('shows maintenance support versions grouped together', () => {
      // The group heading "Maintenance Support" is technically hidden by PatternFly
      // Would recommend moving away from the custom PF Select Group and move to using an optgroup tag

      // There are 3 listboxes - one that is the parent and two children corresponding to Full Support and Maintenance support
      // This is an accessibility issue (listboxes cannot be children of other listboxes)
      // Assuming the second child listbox is the Maintenance Support list

      // Arrange
      render(<VersionSelection {...defaultProps} />);
      const inMainListBox = screen.getAllByRole('listbox')[0];

      expect(within(inMainListBox).getAllByRole('listbox')).toHaveLength(2);

      // Assert
      const maintenanceSupportList = within(inMainListBox).getAllByRole('listbox')[1];
      expect(within(maintenanceSupportList).getAllByRole('option')).toHaveLength(3);

      expect(
        within(maintenanceSupportList).getByRole('option', { name: '4.11.4' }),
      ).toBeInTheDocument();
      expect(
        within(maintenanceSupportList).getByRole('option', { name: '4.11.3' }),
      ).toBeInTheDocument();
      expect(
        within(maintenanceSupportList).getByRole('option', { name: '4.10.1' }),
      ).toBeInTheDocument();
    });

    it('Check for preselected version', () => {
      // Arrange
      const selectedClusterVersion = versions.find((version) => version.raw_id === '4.12.1');

      const newProps = {
        ...defaultProps,
        selectedClusterVersion,
      };
      expect(selectedClusterVersion).not.toBeUndefined();

      // @ts-ignore
      render(<VersionSelection {...newProps} />);

      // Assert
      expect(screen.getAllByRole('option', { selected: true })).toHaveLength(1);
      expect(screen.getByRole('option', { selected: true, name: '4.12.1' })).toBeInTheDocument();
    });

    it('opens/closes the user clicks on main menu button', async () => {
      // Arrange
      const user = userEvent.setup();
      const newProps = {
        ...defaultProps,
        isOpen: false,
      };
      render(<VersionSelection {...newProps} />);

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

      // Act
      await user.click(screen.getByLabelText(componentText.BUTTON.label));

      // Assert
      expect(screen.getAllByRole('listbox').length).toBeGreaterThan(0);
      expect(screen.getByLabelText('Version select label')).toBeInTheDocument();

      // Act
      await user.click(screen.getByLabelText(componentText.BUTTON.label));

      // Assert
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('calls getInstallableVersions when there was an error and the menu is opened', async () => {
      // Arrange
      const user = userEvent.setup();
      const mockGetInstallableVersions = jest.fn();
      const newProps = {
        ...defaultProps,
        isOpen: false,
        getInstallableVersionsResponse: {
          error: true,
          pending: false,
          fulfilled: true,
          errorMessage: 'This is a custom error message',
        },
        getInstallableVersions: mockGetInstallableVersions,
      };

      render(<VersionSelection {...newProps} />);
      expect(mockGetInstallableVersions.mock.calls).toHaveLength(0);

      // Act
      await user.click(screen.getByLabelText(componentText.BUTTON.label));

      // Assert
      expect(mockGetInstallableVersions.mock.calls).toHaveLength(1);
    });

    it("calls input's onChange function when an option is selected", async () => {
      // Arrange
      const selectedClusterVersion = versions.find((version) => version.raw_id === '4.12.1');
      expect(selectedClusterVersion).not.toBeUndefined();

      const user = userEvent.setup();
      const mockInputOnChange = jest.fn();
      const newProps = {
        ...defaultProps,
        isOpen: true,
        input: { onChange: mockInputOnChange },
      };

      render(<VersionSelection {...newProps} />);

      // this is due to preselecting an item
      expect(mockInputOnChange.mock.calls).toHaveLength(1);

      // Act
      await user.click(screen.getByRole('option', { name: '4.12.1' }));

      // Assert
      expect(mockInputOnChange.mock.calls).toHaveLength(2);
      expect(mockInputOnChange.mock.calls[1][0]).toEqual(selectedClusterVersion);
    });

    it('button to expand menu is disabled when isDisabled is sent as a prop', () => {
      // Arrange
      const newProps = {
        ...defaultProps,
        isOpen: false,
        isDisabled: true,
      };

      render(<VersionSelection {...newProps} />);

      // Assert
      expect(screen.getByLabelText(componentText.BUTTON.label)).toBeDisabled();
    });
  });
});

const mockOCPLifeCycleStatusData = [
  [
    {
      uuid: '0964595a-151e-4240-8a62-31e6c3730226',
      name: 'OpenShift Container Platform 4',
      former_names: [],
      show_last_minor_release: false,
      show_final_minor_release: false,
      is_layered_product: false,
      all_phases: [
        {
          name: 'General availability',
          ptype: 'normal',
          tooltip: undefined,
          display_name: 'General availability',
        },
        {
          name: 'Full support',
          ptype: 'normal',
          tooltip: undefined,
          display_name: 'Full support ends',
        },
        {
          name: 'Maintenance support',
          ptype: 'normal',
          tooltip: undefined,
          display_name: 'Maintenance support ends',
        },
        {
          name: 'Extended update support',
          ptype: 'normal',
          tooltip: undefined,
          display_name: 'Extended update support ends',
        },
        {
          name: 'Extended life phase',
          ptype: 'extended',
          tooltip:
            'The Extended Life Cycle Phase (ELP) is the post-retirement time period. We require that customers running Red Hat Enterprise Linux products beyond their retirement continue to have active subscriptions which ensures that they continue receiving access to all previously released content, documentation, and knowledge base articles as well as receive limited technical support. As there are no bug fixes, security fixes, hardware enablement, or root cause analysis available during the Extended Life Phase, customers may choose to purchase the Extended Life Cycle Support Add-On during the Extended Life Phase, which will provide them with critical impact security fixes and selected urgent priority bug fixes.',
          display_name: 'Extended life phase ends',
        },
      ],
      versions: [
        {
          name: '4.12',
          type: 'Full Support',
          last_minor_release: null,
          final_minor_release: null,
          extra_header_value: null,
          phases: [
            {
              name: 'General availability',
              date: '2023-01-17T00:00:00.000Z',
              date_format: 'date',
            },
            { name: 'Full support', date: 'Release of 4.13 + 3 months', date_format: 'string' },
            {
              name: 'Maintenance support',
              date: '2024-07-17T00:00:00.000Z',
              date_format: 'date',
            },
            {
              name: 'Extended update support',
              date: '2025-01-17T00:00:00.000Z',
              date_format: 'date',
            },
            { name: 'Extended life phase', date: '', date_format: 'string' },
          ],
          extra_dependences: [],
        },
        {
          name: '4.11',
          type: 'Maintenance Support',
          last_minor_release: null,
          final_minor_release: null,
          extra_header_value: null,
          phases: [
            {
              name: 'General availability',
              date: '2022-08-10T00:00:00.000Z',
              date_format: 'date',
            },
            { name: 'Full support', date: '2023-04-17T00:00:00.000Z', date_format: 'date' },
            {
              name: 'Maintenance support',
              date: '2024-02-10T00:00:00.000Z',
              date_format: 'date',
            },
            { name: 'Extended update support', date: 'N/A', date_format: 'string' },
            { name: 'Extended life phase', date: 'N/A', date_format: 'string' },
          ],
          extra_dependences: [],
        },
        {
          name: '4.10',
          type: 'Maintenance Support',
          last_minor_release: null,
          final_minor_release: null,
          extra_header_value: null,
          phases: [
            {
              name: 'General availability',
              date: '2022-03-10T00:00:00.000Z',
              date_format: 'date',
            },
            { name: 'Full support', date: '2022-11-10T00:00:00.000Z', date_format: 'date' },
            {
              name: 'Maintenance support',
              date: '2023-09-10T00:00:00.000Z',
              date_format: 'date',
            },
            { name: 'Extended update support', date: 'N/A', date_format: 'string' },
            { name: 'Extended life phase', date: 'N/A', date_format: 'string' },
          ],
          extra_dependences: [],
        },
      ],
      link: 'https://access.redhat.com/support/policy/updates/openshift/',
      policies: 'https://access.redhat.com/site/support/policy/updates/openshift/policies/',
    },
  ],
  true,
];
