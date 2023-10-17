import React from 'react';
import { render, checkAccessibility } from '~/testUtils';
import wizardConnector from '~/components/clusters/CreateOSDPage/CreateOSDWizard/WizardConnector';
import AccountRolesARNsSection, { getDefaultInstallerRole } from './AccountRolesARNsSection';

const accountRolesARNs = [
  {
    ControlPlane: 'arn:aws:iam::000000000006:role/ManagedOpenShift-ControlPlane-Role',
    Installer: 'arn:aws:iam::000000000006:role/ManagedOpenShift-Installer-Role',
    Support: 'arn:aws:iam::000000000006:role/ManagedOpenShift-Support-Role',
    Worker: 'arn:aws:iam::000000000006:role/ManagedOpenShift-Worker-Role',
    hcpManagedPolicies: false,
    isAdmin: false,
    managedPolicies: false,
    prefix: 'ManagedOpenShift',
    version: '4.13',
  },
  {
    ControlPlane: 'arn:aws:iam::000000000006:role/incomplete-1-ControlPlane-Role',
    Installer: 'arn:aws:iam::000000000006:role/incomplete-1-Installer-Role',
    Support: undefined,
    Worker: undefined,
    hcpManagedPolicies: false,
    isAdmin: false,
    managedPolicies: false,
    prefix: 'incomplete-1',
    version: '4.13',
  },
  {
    ControlPlane: 'arn:aws:iam::000000000006:role/nonManagedComplete-1-ControlPlane-Role',
    Installer: 'arn:aws:iam::000000000006:role/nonManagedComplete-1-Installer-Role',
    Support: 'arn:aws:iam::000000000006:role/nonManagedComplete-1-Support-Role',
    Worker: 'arn:aws:iam::000000000006:role/nonManagedComplete-1-Worker-Role',
    hcpManagedPolicies: false,
    isAdmin: false,
    managedPolicies: false,
    prefix: 'nonManagedComplete-1',
    version: '4.13',
  },
  {
    ControlPlane: 'arn:aws:iam::000000000006:role/incomplete-2-ControlPlane-Role',
    Installer: undefined,
    Support: undefined,
    Worker: 'arn:aws:iam::000000000006:role/incomplete-2-Worker-Role',
    hcpManagedPolicies: false,
    isAdmin: false,
    managedPolicies: false,
    prefix: 'incomplete-2',
    version: '4.13',
  },
  {
    ControlPlane: 'arn:aws:iam::000000000006:role/nonManagedComplete-2-ControlPlane-Role',
    Installer: 'arn:aws:iam::000000000006:role/nonManagedComplete-2-Installer-Role',
    Support: 'arn:aws:iam::000000000006:role/nonManagedComplete-2-Support-Role',
    Worker: 'arn:aws:iam::000000000006:role/nonManagedComplete-2-Worker-Role',
    hcpManagedPolicies: false,
    isAdmin: false,
    managedPolicies: false,
    prefix: 'nonManagedComplete-2',
    version: '4.13',
  },
  {
    ControlPlane: 'arn:aws:iam::000000000006:role/test-managed-ControlPlane-Role',
    Installer: 'arn:aws:iam::000000000006:role/test-managed-Installer-Role',
    Support: 'arn:aws:iam::000000000006:role/test-managed-Support-Role',
    Worker: 'arn:aws:iam::000000000006:role/test-managed-Worker-Role',
    hcpManagedPolicies: false,
    isAdmin: false,
    managedPolicies: true,
    prefix: 'test-managed',
    version: '4.13',
  },
];

const defaultProps = {
  selectedInstallerRoleARN: accountRolesARNs[0].Installer,
  selectedAWSAccountID: '000000000006',
  getAWSAccountRolesARNs: () => {},
  getAWSAccountRolesARNsResponse: accountRolesARNs,
  clearGetAWSAccountRolesARNsResponse: () => {},
  onAccountChanged: () => {},
};

describe('AccountRolesARNsSection', () => {
  const ConnectedAccountsRolesARNsSection = wizardConnector(AccountRolesARNsSection);

  it('is accessible', async () => {
    const { container } = render(<ConnectedAccountsRolesARNsSection {...defaultProps} />, {});
    await checkAccessibility(container);
  });

  it('defaults to IAM role with prefix -ManagedOpenShift', () => {
    const selectedInstallerRoleARN = '';
    const defaultInstallerRole = getDefaultInstallerRole(
      selectedInstallerRoleARN,
      accountRolesARNs,
    );
    expect(defaultInstallerRole).toBe(
      'arn:aws:iam::000000000006:role/ManagedOpenShift-Installer-Role',
    );
  });

  it('defaults to first managed policy role if no -ManagedOpenShift prefixed role exists', () => {
    const selectedInstallerRoleARN = '';
    const updatedAccountRolesARNs = accountRolesARNs.slice(1);
    const defaultInstallerRole = getDefaultInstallerRole(
      selectedInstallerRoleARN,
      updatedAccountRolesARNs,
    );
    expect(defaultInstallerRole).toBe('arn:aws:iam::000000000006:role/test-managed-Installer-Role');
  });

  it('defaults to first complete role set if no -ManagedOpenShift prefix or managed policy role exists', () => {
    const selectedInstallerRoleARN = '';
    const indexes = [0, 5];
    const updatedAccountRolesARNs = accountRolesARNs.filter((_, index) => !indexes.includes(index));
    const defaultInstallerRole = getDefaultInstallerRole(
      selectedInstallerRoleARN,
      updatedAccountRolesARNs,
    );
    expect(defaultInstallerRole).toBe(
      'arn:aws:iam::000000000006:role/nonManagedComplete-1-Installer-Role',
    );
  });
  it('defaults to first incomplete role set if no -ManagedOpenshift prefix, managed policy, or complete role set exists', () => {
    const selectedInstallerRoleARN = '';
    const indexes = [0, 2, 4, 5];
    const updatedAccountRolesARNs = accountRolesARNs.filter((_, index) => !indexes.includes(index));
    const defaultInstallerRole = getDefaultInstallerRole(
      selectedInstallerRoleARN,
      updatedAccountRolesARNs,
    );
    expect(defaultInstallerRole).toBe('arn:aws:iam::000000000006:role/incomplete-1-Installer-Role');
  });
});
