import React from 'react';
import { render, screen, fireEvent, checkAccessibility } from '~/testUtils';
import wizardConnector from '~/components/clusters/CreateOSDPage/CreateOSDWizard/WizardConnector';
import * as useFeatureGate from '~/hooks/useFeatureGate';
import { HCP_USE_UNMANAGED } from '~/redux/constants/featureConstants';
import AccountRolesARNsSection from './AccountRolesARNsSection';

jest.mock('~/hooks/useAnalytics', () => jest.fn(() => jest.fn()));

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
    render(<ConnectedAccountRolesARNsSection {...newProps} />);

    // expand installer drop-down
    // user.click doesn't work with PF dropdowns, so required to use fireEvent
    fireEvent.click(screen.getByRole('button', { name: 'Options menu' }));

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

  it('Shows only managed policy roles for hypershift cluster and feature flag is false', () => {
    useFeatureGateMock.mockImplementation(gateValue(HCP_USE_UNMANAGED, false));

    const newProps = { ...props, isHypershiftSelected: true };
    render(<ConnectedAccountRolesARNsSection {...newProps} />);

    // expand installer drop-down
    // user.click doesn't work with PF dropdowns, so required to use fireEvent
    fireEvent.click(screen.getByRole('button', { name: 'Options menu' }));

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

  it('Shows only both managed and unmanaged policy roles for hypershift cluster and feature flag is true', () => {
    useFeatureGateMock.mockImplementation(gateValue(HCP_USE_UNMANAGED, true));

    const newProps = { ...props, isHypershiftSelected: true };
    render(<ConnectedAccountRolesARNsSection {...newProps} />);

    // expand installer drop-down
    // user.click doesn't work with PF dropdowns, so required to use fireEvent
    fireEvent.click(screen.getByRole('button', { name: 'Options menu' }));

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
});
