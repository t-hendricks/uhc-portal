import React from 'react';
import { render, screen, checkAccessibility } from '~/testUtils';
import wizardConnector from '~/components/clusters/CreateOSDPage/CreateOSDWizard/WizardConnector';
import * as useFeatureGate from '~/hooks/useFeatureGate';
import { HCP_USE_UNMANAGED } from '~/redux/constants/featureConstants';
import { ROSA_HOSTED_CLI_MIN_VERSION } from '~/components/clusters/CreateROSAPage/CreateROSAWizard/rosaConstants';
import AccountRolesARNsSection from './AccountRolesARNsSection';

const latestOCPVersion = '4.13.3';
const latestVersionLoaded = '4.13.5';

jest.mock('~/hooks/useAnalytics', () => jest.fn(() => jest.fn()));
jest.mock('~/components/releases/hooks', () => ({
  useOCPLatestVersion: () => [latestOCPVersion, latestVersionLoaded],
}));

const accountRolesList = [
  {
    prefix: 'myManagedRoles',
    managedPolicies: true,
    hcpManagedPolicies: true,
    version: '4.13.0',
    Installer: 'arn:aws:iam::123456789012:role/myManagedRoles-HCP-ROSA-Installer-Role',
    Support: 'arn:aws:iam::123456789012:role/myManagedRoles-HCP-ROSA-Support-Role',
    Worker: 'arn:aws:iam::123456789012:role/myManagedRoles-HCP-ROSA-Worker-Role',
  },
  {
    prefix: 'myUnManagedRoles',
    managedPolicies: false,
    hcpManagedPolicies: false,
    version: '4.13.0',
    ControlPlane: 'arn:aws:iam::123456789012:role/myUnManagedRoles-ControlPlane-Role',
    Installer: 'arn:aws:iam::123456789012:role/myUnManagedRoles-Installer-Role',
    Support: 'arn:aws:iam::123456789012:role/myUnManagedRoles-Support-Role',
    Worker: 'arn:aws:iam::123456789012:role/myUnManagedRoles-Worker-Role',
  },
  {
    prefix: 'bothRoles',
    managedPolicies: true,
    hcpManagedPolicies: true,
    version: '4.13.0',
    Installer: 'arn:aws:iam::123456789012:role/bothRoles-HCP-ROSA-Installer-Role',
    Support: 'arn:aws:iam::123456789012:role/bothRoles-HCP-ROSA-Support-Role',
    Worker: 'arn:aws:iam::123456789012:role/bothRoles-HCP-ROSA-Worker-Role',
  },
  {
    prefix: 'bothRoles',
    managedPolicies: false,
    hcpManagedPolicies: false,
    version: '4.13.0',
    ControlPlane: 'arn:aws:iam::123456789012:role/bothRoles-ControlPlane-Role',
    Installer: 'arn:aws:iam::123456789012:role/bothRoles-Installer-Role',
    Support: 'arn:aws:iam::123456789012:role/bothRoles-Support-Role',
    Worker: 'arn:aws:iam::123456789012:role/bothRoles-Worker-Role',
  },
];

const gateValue = (wantedGate, value) => (gate) => gate === wantedGate ? value : false;

describe('<AccountRolesARNsSection />', () => {
  const useFeatureGateMock = jest.spyOn(useFeatureGate, 'useFeatureGate');
  afterEach(() => {
    jest.clearAllMocks();
    useFeatureGateMock.mockReset();
  });

  const props = {
    touch: jest.fn(),
    change: jest.fn(),
    selectedAWSAccountID: '',
    selectedInstallerRoleARN: '',
    rosaMaxOSVersion: '4.13.1',
    getAWSAccountRolesARNs: jest.fn(),
    getAWSAccountRolesARNsResponse: {
      fulfilled: true,
      error: false,
      pending: false,
      data: accountRolesList,
    },
    clearGetAWSAccountRolesARNsResponse: jest.fn(),
    isHypershiftSelected: true,
    onAccountChanged: jest.fn(),
  };

  const ConnectedAccountRolesARNsSection = wizardConnector(AccountRolesARNsSection);

  it('is accessible', async () => {
    const { container } = render(<ConnectedAccountRolesARNsSection {...props} />);
    await checkAccessibility(container);
  });

  it('Shows only unmanaged policy roles for non hypershift cluster', async () => {
    const newProps = { ...props, isHypershiftSelected: false };
    const { user } = render(<ConnectedAccountRolesARNsSection {...newProps} />);

    // expand installer drop-down
    await user.click(screen.getByRole('button', { name: 'Options menu' }));

    expect(
      screen.getByRole('option', {
        name: 'arn:aws:iam::123456789012:role/myUnManagedRoles-Installer-Role',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('option', {
        name: 'arn:aws:iam::123456789012:role/bothRoles-Installer-Role',
      }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole('option', {
        name: 'arn:aws:iam::123456789012:role/myManagedRoles-HCP-ROSA-Installer-Role',
      }),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole('option', {
        name: 'arn:aws:iam::123456789012:role/bothRoles-HCP-ROSA-Installer-Role',
      }),
    ).not.toBeInTheDocument();
  });

  it('Shows only managed policy roles for hypershift cluster and feature flag is false', async () => {
    useFeatureGateMock.mockImplementation(gateValue(HCP_USE_UNMANAGED, false));

    const newProps = { ...props, isHypershiftSelected: true };
    const { user } = render(<ConnectedAccountRolesARNsSection {...newProps} />);

    // expand installer drop-down
    await user.click(screen.getByRole('button', { name: 'Options menu' }));

    expect(
      screen.queryByRole('option', {
        name: 'arn:aws:iam::123456789012:role/myUnManagedRoles-Installer-Role',
      }),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole('option', {
        name: 'arn:aws:iam::123456789012:role/bothRoles-Installer-Role',
      }),
    ).not.toBeInTheDocument();

    expect(
      screen.getByRole('option', {
        name: 'arn:aws:iam::123456789012:role/myManagedRoles-HCP-ROSA-Installer-Role',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('option', {
        name: 'arn:aws:iam::123456789012:role/bothRoles-HCP-ROSA-Installer-Role',
      }),
    ).toBeInTheDocument();
  });

  it('Shows only both managed and unmanaged policy roles for hypershift cluster and feature flag is true', async () => {
    useFeatureGateMock.mockImplementation(gateValue(HCP_USE_UNMANAGED, true));

    const newProps = { ...props, isHypershiftSelected: true };
    const { user } = render(<ConnectedAccountRolesARNsSection {...newProps} />);

    // expand installer drop-down
    await user.click(screen.getByRole('button', { name: 'Options menu' }));

    expect(
      screen.getByRole('option', {
        name: 'arn:aws:iam::123456789012:role/myUnManagedRoles-Installer-Role',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('option', {
        name: 'arn:aws:iam::123456789012:role/bothRoles-Installer-Role',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('option', {
        name: 'arn:aws:iam::123456789012:role/myManagedRoles-HCP-ROSA-Installer-Role',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('option', {
        name: 'arn:aws:iam::123456789012:role/bothRoles-HCP-ROSA-Installer-Role',
      }),
    ).toBeInTheDocument();
  });

  describe('default installer role', () => {
    const ManagedOpenShiftInstallerRole = {
      ControlPlane: 'arn:aws:iam::000000000006:role/ManagedOpenShift-ControlPlane-Role',
      Installer: 'arn:aws:iam::000000000006:role/ManagedOpenShift-Installer-Role',
      Support: 'arn:aws:iam::000000000006:role/ManagedOpenShift-Support-Role',
      Worker: 'arn:aws:iam::000000000006:role/ManagedOpenShift-Worker-Role',
      hcpManagedPolicies: false,
      isAdmin: false,
      managedPolicies: false,
      prefix: 'ManagedOpenShift',
      version: '4.13',
    };

    const nonManagedCompleteInstallerRole = {
      ControlPlane: 'arn:aws:iam::000000000006:role/nonManagedComplete-1-ControlPlane-Role',
      Installer: 'arn:aws:iam::000000000006:role/nonManagedComplete-1-Installer-Role',
      Support: 'arn:aws:iam::000000000006:role/nonManagedComplete-1-Support-Role',
      Worker: 'arn:aws:iam::000000000006:role/nonManagedComplete-1-Worker-Role',
      hcpManagedPolicies: false,
      isAdmin: false,
      managedPolicies: false,
      prefix: 'nonManagedComplete-1',
      version: '4.13',
    };
    const nonManagedCompleteInstallerRole2 = {
      ControlPlane: 'arn:aws:iam::000000000006:role/nonManagedComplete-2-ControlPlane-Role',
      Installer: 'arn:aws:iam::000000000006:role/nonManagedComplete-2-Installer-Role',
      Support: 'arn:aws:iam::000000000006:role/nonManagedComplete-2-Support-Role',
      Worker: 'arn:aws:iam::000000000006:role/nonManagedComplete-2-Worker-Role',
      hcpManagedPolicies: false,
      isAdmin: false,
      managedPolicies: false,
      prefix: 'nonManagedComplete-2',
      version: '4.13',
    };
    const testManagedInstallerRole = {
      ControlPlane: 'arn:aws:iam::000000000006:role/test-managed-ControlPlane-Role',
      Installer: 'arn:aws:iam::000000000006:role/test-managed-Installer-Role',
      Support: 'arn:aws:iam::000000000006:role/test-managed-Support-Role',
      hcpManagedPolicies: true,
      isAdmin: false,
      managedPolicies: true,
      prefix: 'test-managed',
      version: '4.13',
    };

    const incompleteNonManagedInstallerRole = {
      ControlPlane: 'arn:aws:iam::000000000006:role/incomplete-1-ControlPlane-Role',
      Installer: 'arn:aws:iam::000000000006:role/incomplete-1-Installer-Role',
      Support: undefined,
      Worker: undefined,
      hcpManagedPolicies: false,
      isAdmin: false,
      managedPolicies: false,
      prefix: 'incomplete-1',
      version: '4.13',
    };
    const incompleteNonManagedInstallerRole2 = {
      ControlPlane: 'arn:aws:iam::000000000006:role/incomplete-2-ControlPlane-Role',
      Installer: 'arn:aws:iam::000000000006:role/incomplete-2-Installer-Role',
      Support: undefined,
      Worker: undefined,
      hcpManagedPolicies: false,
      isAdmin: false,
      managedPolicies: false,
      prefix: 'incomplete-1',
      version: '4.13',
    };

    // Note: These tests work because on mount, the Installer arn drop down only shows the selected version

    it('defaults to IAM role with prefix -ManagedOpenShift', () => {
      useFeatureGateMock.mockImplementation(gateValue(HCP_USE_UNMANAGED, true));
      const roleList = [
        nonManagedCompleteInstallerRole,
        ManagedOpenShiftInstallerRole, // This is the first "-ManagedOpenShift" role
        nonManagedCompleteInstallerRole2,
        testManagedInstallerRole,
      ];
      const newProps = {
        ...props,
        isHypershiftSelected: true,
        getAWSAccountRolesARNsResponse: {
          fulfilled: true,
          error: false,
          pending: false,
          data: roleList,
        },
      };
      render(<ConnectedAccountRolesARNsSection {...newProps} />);
      expect(screen.getByText(ManagedOpenShiftInstallerRole.Installer)).toBeInTheDocument();
    });

    it('defaults to first managed policy role if no -ManagedOpenShift prefixed role exists', () => {
      useFeatureGateMock.mockImplementation(gateValue(HCP_USE_UNMANAGED, true));
      const roleList = [
        incompleteNonManagedInstallerRole,
        nonManagedCompleteInstallerRole,
        testManagedInstallerRole, // This is the first  managed policy
      ];
      const newProps = {
        ...props,
        isHypershiftSelected: true,
        getAWSAccountRolesARNsResponse: {
          fulfilled: true,
          error: false,
          pending: false,
          data: roleList,
        },
      };
      render(<ConnectedAccountRolesARNsSection {...newProps} />);
      expect(screen.getByText(testManagedInstallerRole.Installer)).toBeInTheDocument();
    });

    it('defaults to first complete role set if no -ManagedOpenShift prefix or managed policy role exists', () => {
      useFeatureGateMock.mockImplementation(gateValue(HCP_USE_UNMANAGED, true));
      const roleList = [
        incompleteNonManagedInstallerRole,
        nonManagedCompleteInstallerRole, // This is the first complete set
        nonManagedCompleteInstallerRole2,
      ];
      const newProps = {
        ...props,
        isHypershiftSelected: true,
        getAWSAccountRolesARNsResponse: {
          fulfilled: true,
          error: false,
          pending: false,
          data: roleList,
        },
      };
      render(<ConnectedAccountRolesARNsSection {...newProps} />);
      expect(screen.getByText(nonManagedCompleteInstallerRole.Installer)).toBeInTheDocument();
    });

    it('defaults to first incomplete role set if no -ManagedOpenshift prefix, managed policy, or complete role set exists', () => {
      useFeatureGateMock.mockImplementation(gateValue(HCP_USE_UNMANAGED, true));
      const roleList = [
        incompleteNonManagedInstallerRole, // this is the first
        incompleteNonManagedInstallerRole2,
      ];
      const newProps = {
        ...props,
        isHypershiftSelected: true,
        getAWSAccountRolesARNsResponse: {
          fulfilled: true,
          error: false,
          pending: false,
          data: roleList,
        },
      };
      render(<ConnectedAccountRolesARNsSection {...newProps} />);
      expect(screen.getByText(incompleteNonManagedInstallerRole.Installer)).toBeInTheDocument();
    });
  });

  describe('ROSA CLI requirement message', () => {
    const rosaCLIMessage = `You must use ROSA CLI version ${ROSA_HOSTED_CLI_MIN_VERSION} or above.`;

    const getIncompleteRoleSets = ({ isHypershift }) =>
      accountRolesList.map((role) => {
        const compatibleRoleSets = isHypershift
          ? ['myManagedRoles']
          : ['bothRoles', 'myUnManagedRoles'];
        return compatibleRoleSets.includes(role.prefix) ? { ...role, Support: undefined } : role;
      });

    it('is shown when not all ARNs are detected and Hypershift has been selected', () => {
      const testProps = {
        ...props,
        getAWSAccountRolesARNsResponse: {
          fulfilled: true,
          error: false,
          pending: false,
          data: getIncompleteRoleSets({ isHypershift: true }),
        },
      };
      render(<ConnectedAccountRolesARNsSection {...testProps} />);

      expect(screen.getByText(rosaCLIMessage)).toBeInTheDocument();
    });

    it('is not shown when not all ARNs are detected and ROSA classic has been selected', () => {
      const newProps = {
        ...props,
        getAWSAccountRolesARNsResponse: {
          fulfilled: true,
          error: false,
          pending: false,
          data: getIncompleteRoleSets({ isHypershift: false }),
        },
        isHypershiftSelected: false,
      };
      render(<ConnectedAccountRolesARNsSection {...newProps} />);

      expect(screen.queryByText(rosaCLIMessage)).not.toBeInTheDocument();
      expect(screen.getByText('Some account roles ARNs were not detected')).toBeInTheDocument();
    });
  });
});
