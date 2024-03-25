import React from 'react';

import { render, screen, within, checkAccessibility } from '~/testUtils';
import * as ReleaseHooks from '~/components/releases/hooks';
import * as helpers from '~/common/helpers';
import { ProductLifeCycle } from '~/types/product-life-cycles';
import VersionSelection from '../VersionSelection';
import { mockOCPLifeCycleStatusData } from './VersionSelection.fixtures';

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
  meta: { error: '', touched: false },
  getInstallableVersions: jest.fn(),
  getInstallableVersionsResponse,
  selectedClusterVersion: undefined,
};

// NOTE:
// These tests will create numerous warnings about improper props
// These are coming from the PatternFly select items
// For example:  Warning: React does not recognize the `inputId` prop on a DOM element.

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
    await checkAccessibility(container);
  });

  it('is accessible when closed', async () => {
    // Arrange
    const newProps = {
      ...defaultProps,
      isOpen: false,
    };
    const { container } = render(<VersionSelection {...newProps} />);

    // Assert
    await checkAccessibility(container);
  });

  describe(' calls getInstallableVersions', () => {
    const mockGetInstallableVersions = jest.fn();

    afterEach(() => {
      mockGetInstallableVersions.mockClear();
    });
    it(' is not called when it has already called and control plane has not changed', () => {
      expect(mockGetInstallableVersions.mock.calls).toHaveLength(0);
      const newProps = {
        ...defaultProps,
        isHypershiftSelected: true,
        getInstallableVersionsResponse: {
          error: false,
          pending: false,
          fulfilled: true,
          params: { product: 'hcp' },
        },
        getInstallableVersions: mockGetInstallableVersions,
      };
      render(<VersionSelection {...newProps} />);

      expect(mockGetInstallableVersions.mock.calls).toHaveLength(0);
    });

    it('when getInstallableVersions on mount has not been called before', () => {
      expect(mockGetInstallableVersions.mock.calls).toHaveLength(0);
      const newProps = {
        ...defaultProps,
        getInstallableVersionsResponse: {
          error: false,
          pending: false,
          fulfilled: false,
        },
        getInstallableVersions: mockGetInstallableVersions,
      };
      render(<VersionSelection {...newProps} />);

      expect(mockGetInstallableVersions.mock.calls).toHaveLength(1);
    });

    it('on mount when last call ended in error', () => {
      expect(mockGetInstallableVersions.mock.calls).toHaveLength(0);
      const newProps = {
        ...defaultProps,
        getInstallableVersionsResponse: {
          error: true,
          pending: false,
          fulfilled: true,
        },
        getInstallableVersions: mockGetInstallableVersions,
      };
      render(<VersionSelection {...newProps} />);

      expect(mockGetInstallableVersions.mock.calls).toHaveLength(1);
    });

    it('on mount if control plane switched from classic to HCP', () => {
      expect(mockGetInstallableVersions.mock.calls).toHaveLength(0);
      const newProps = {
        ...defaultProps,
        isHypershiftSelected: false,
        getInstallableVersionsResponse: {
          error: false,
          pending: false,
          fulfilled: true,
          params: { product: 'hcp' },
        },
        getInstallableVersions: mockGetInstallableVersions,
      };
      render(<VersionSelection {...newProps} />);

      expect(mockGetInstallableVersions.mock.calls).toHaveLength(1);
    });

    it('on mount if control plane switched from HCP to classic', () => {
      expect(mockGetInstallableVersions.mock.calls).toHaveLength(0);
      const newProps = {
        ...defaultProps,
        isHypershiftSelected: true,
        getInstallableVersionsResponse: {
          error: false,
          pending: false,
          fulfilled: true,
          params: {},
        },
        getInstallableVersions: mockGetInstallableVersions,
      };
      render(<VersionSelection {...newProps} />);

      expect(mockGetInstallableVersions.mock.calls).toHaveLength(1);
    });

    it('when there was an error and the menu is opened', async () => {
      // Arrange
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

      const { user } = render(<VersionSelection {...newProps} />);

      // Called on mount because of error when mounted
      expect(mockGetInstallableVersions.mock.calls).toHaveLength(1);

      // Act
      await user.click(screen.getByLabelText(componentText.BUTTON.label));

      // Assert
      expect(mockGetInstallableVersions.mock.calls).toHaveLength(2);
    });
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

    it('Selects latest version when it is both rosa and hypershift enabled', () => {
      const onChangeMock = jest.fn();
      const newVersions = [...versions];

      const latestVersion = {
        ...versions[0],
        raw_id: '4.12.99',
        id: 'openshift-v4.12.99',
        default: false,
        enabled: true,
        rosa_enabled: true,
        hosted_control_plane_enabled: true,
      };

      newVersions.unshift(latestVersion);

      const newProps = {
        ...defaultProps,
        isHypershiftSelected: true,
        getInstallableVersionsResponse: {
          ...defaultProps.getInstallableVersionsResponse,
          versions: newVersions,
        },
        input: { onChange: onChangeMock },
      };
      render(<VersionSelection {...newProps} />);

      // onChange is called on render to set the default version
      expect(onChangeMock).toBeCalled();
      expect(onChangeMock).toBeCalledWith(latestVersion);
    });

    it('Selects version that is hypershift enabled when the latest is not hypershift enabled', () => {
      const onChangeMock = jest.fn();
      const newVersions = [...versions];

      const latestVersion = {
        ...versions[0],
        raw_id: '4.12.99',
        id: 'openshift-v4.12.99',
        default: false,
        enabled: true,
        rosa_enabled: true,
        hosted_control_plane_enabled: false,
      };

      newVersions.unshift(latestVersion);

      const newProps = {
        ...defaultProps,
        isHypershiftSelected: true,
        getInstallableVersionsResponse: {
          ...defaultProps.getInstallableVersionsResponse,
          versions: newVersions,
        },
        input: { onChange: onChangeMock },
      };
      render(<VersionSelection {...newProps} />);

      // onChange is called on render to set the default version
      expect(onChangeMock).toBeCalled();

      expect(newVersions[1].rosa_enabled).toBeTruthy();
      expect(newVersions[1].hosted_control_plane_enabled).toBeTruthy();
      expect(onChangeMock).not.toBeCalledWith(latestVersion);
      expect(onChangeMock).toBeCalledWith(newVersions[1]);
    });

    it('Selects version that is hypershift enabled when the latest is neither hypershift nor rosa enabled', () => {
      const onChangeMock = jest.fn();
      const newVersions = [...versions];

      const latestVersion = {
        ...versions[0],
        raw_id: '4.12.99',
        id: 'openshift-v4.12.99',
        default: false,
        enabled: true,
        rosa_enabled: false,
        hosted_control_plane_enabled: false,
      };

      newVersions.unshift(latestVersion);

      const newProps = {
        ...defaultProps,
        isHypershiftSelected: true,
        getInstallableVersionsResponse: {
          ...defaultProps.getInstallableVersionsResponse,
          versions: newVersions,
        },
        input: { onChange: onChangeMock },
      };
      render(<VersionSelection {...newProps} />);

      // onChange is called on render to set the default version
      expect(onChangeMock).toBeCalled();

      expect(newVersions[1].rosa_enabled).toBeTruthy();
      expect(newVersions[1].hosted_control_plane_enabled).toBeTruthy();
      expect(onChangeMock).not.toBeCalledWith(latestVersion);
      expect(onChangeMock).toBeCalledWith(newVersions[1]);
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
        within(screen.getByTestId('alert-error')).getByText(/Error getting cluster versions/),
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
      const newProps = {
        ...defaultProps,
        isRosa: true,
        rosaMaxOSVersion: '4.11.3',
      };
      const { user } = render(<VersionSelection {...newProps} />);

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

    it('Selects the latest version if it is rosa enabled', () => {
      const onChangeMock = jest.fn();
      const newVersions = [...versions];

      const latestVersion = {
        ...versions[0],
        raw_id: '4.12.99',
        id: 'openshift-v4.12.99',
        default: false,
        enabled: true,
        rosa_enabled: true,
        hosted_control_plane_enabled: false,
      };

      newVersions.unshift(latestVersion);

      const newProps = {
        ...defaultProps,
        isHypershiftSelected: false,
        getInstallableVersionsResponse: {
          ...defaultProps.getInstallableVersionsResponse,
          versions: newVersions,
        },
        input: { onChange: onChangeMock },
      };
      render(<VersionSelection {...newProps} />);

      // onChange is called on render to set the default version
      expect(onChangeMock).toBeCalled();
      expect(onChangeMock).toBeCalledWith(latestVersion);
    });

    it('Selects the first rosa enabled version when the latest version is not rosa enabled', () => {
      const onChangeMock = jest.fn();
      const newVersions = [...versions];

      const latestVersion = {
        ...versions[0],
        raw_id: '4.12.99',
        id: 'openshift-v4.12.99',
        default: false,
        enabled: true,
        rosa_enabled: false,
        hosted_control_plane_enabled: false,
      };

      newVersions.unshift(latestVersion);

      const newProps = {
        ...defaultProps,
        isHypershiftSelected: false,
        getInstallableVersionsResponse: {
          ...defaultProps.getInstallableVersionsResponse,
          versions: newVersions,
        },
        input: { onChange: onChangeMock },
      };
      render(<VersionSelection {...newProps} />);

      // onChange is called on render to set the default version
      expect(onChangeMock).toBeCalled();
      expect(onChangeMock).not.toBeCalledWith(latestVersion);

      expect(newVersions[1].rosa_enabled).toBeTruthy();
      expect(onChangeMock).toBeCalledWith(newVersions[1]);
    });

    it('opens/closes the user clicks on main menu button', async () => {
      // Arrange
      const newProps = {
        ...defaultProps,
        isOpen: false,
      };
      const { user } = render(<VersionSelection {...newProps} />);

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

    it("calls input's onChange function when an option is selected", async () => {
      // Arrange
      const selectedClusterVersion = versions.find((version) => version.raw_id === '4.12.1');
      expect(selectedClusterVersion).not.toBeUndefined();

      const mockInputOnChange = jest.fn();
      const newProps = {
        ...defaultProps,
        isOpen: true,
        input: { onChange: mockInputOnChange },
      };

      const { user } = render(<VersionSelection {...newProps} />);

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

    it('calls input.onChange to set the selected version to "undefined" when selected version is not valid', () => {
      // In this case, it is a hypershift cluster, but the selected version is not hosted_control_plane_enabled

      const newVersions = [
        ...versions,
        {
          channel_group: 'stable',
          default: false,
          enabled: true,
          end_of_life_timestamp: '2024-03-17T00:00:00Z',
          hosted_control_plane_enabled: false,
          id: 'openshift-v4.10.2',
          raw_id: '4.10.2',
          rosa_enabled: true,
        },
      ];
      const mockOnChange = jest.fn();

      const newProps = {
        ...defaultProps,
        input: { onChange: mockOnChange },
        selectedClusterVersion: { raw_id: '4.10.2' },
        isHypershiftSelected: true,
        getInstallableVersionsResponse: {
          error: false,
          errorMessage: '',
          fulfilled: true,
          pending: false,
          valid: true,
          versions: newVersions,
        },
      };

      render(<VersionSelection {...newProps} />);
      expect(mockOnChange).toBeCalled();
      expect(mockOnChange).toBeCalledWith(undefined);
    });

    it('calls input.onChange to set the selected version to "undefined" when selected version does not exist', () => {
      // In this case, the selected version isn't in the version list at all

      const mockOnChange = jest.fn();

      const newProps = {
        ...defaultProps,
        input: { onChange: mockOnChange },
        selectedClusterVersion: { raw_id: '4.10.9999' },
      };

      expect(versions.some((ver) => ver.raw_id === '4.10.999')).toBeFalsy();

      render(<VersionSelection {...newProps} />);
      expect(mockOnChange).toBeCalled();
      expect(mockOnChange).toBeCalledWith(undefined);
    });
  });
});
