import React from 'react';
import { render, checkAccessibility } from '~/testUtils';
import produce from 'immer';
import CloudFormationTab, { getAccountRolePrefix } from './CloudFormationTab';
import fixtures from '../../ClusterDetails/__test__/ClusterDetails.fixtures';

describe('<CloudFormationTab />', () => {
  it('should return the correct account role prefix', () => {
    const prefix = getAccountRolePrefix(fixtures.ROSAManualClusterDetails.cluster);
    expect(prefix).toBe('ManagedOpenShift');
  });

  it('should return the custom account role prefix', () => {
    const customPrefix = produce(fixtures.ROSAManualClusterDetails, (draft) => {
      draft.cluster.aws.sts.role_arn =
        'arn:aws:iam::123456789012:role/Custom-Prefix-Installer-Role';
    });
    const prefix = getAccountRolePrefix(customPrefix.cluster);
    expect(prefix).toBe('Custom-Prefix');
  });

  it('is accessible', async () => {
    const { container } = render(
      <CloudFormationTab cluster={fixtures.ROSAManualClusterDetails.cluster} />,
    );
    await checkAccessibility(container);
  });
});
