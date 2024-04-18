import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import wizardConnector from '../../../common/WizardConnector';
import { EnableExternalAuthentication } from '../EnableExternalAuthentication';

describe('<EnableExternalAuthentication />', () => {
  const ConnectedEnableExternalAuthentication = wizardConnector(EnableExternalAuthentication);

  it('is accessible ', async () => {
    // Arrange
    const { container } = render(<ConnectedEnableExternalAuthentication />);

    // Assert
    await checkAccessibility(container);
  });

  it('renders what it is expected', () => {
    // Arrange
    render(<ConnectedEnableExternalAuthentication />);

    // Assert
    screen.getByText(/allow authentication to be handled by an external provider\./i);
  });
});
