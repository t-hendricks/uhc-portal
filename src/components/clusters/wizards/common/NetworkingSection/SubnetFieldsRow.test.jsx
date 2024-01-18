import React from 'react';
import { render, screen, checkAccessibility } from '~/testUtils';
import wizardConnector from '~/components/clusters/CreateOSDPage/CreateOSDWizard/WizardConnector';
import SubnetFields from './SubnetFields';

describe('<SubnetFields />', () => {
  const ConnectedSubnetFieldRow = wizardConnector(SubnetFields);
  const defaultProps = {
    selectedRegion: 'myRegion',
  };
  it('is accessible', async () => {
    const { container } = render(<ConnectedSubnetFieldRow {...defaultProps} />);

    expect(screen.getByText('Private subnet ID')).toBeInTheDocument();
    await checkAccessibility(container);
  });
});
