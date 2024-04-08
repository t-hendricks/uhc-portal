import React from 'react';
import { checkAccessibility, render, screen } from '~/testUtils';
import CostIcon from '../CostIcon';

describe('<CostIcon />', () => {
  it('is accessible', async () => {
    // Act
    const { container } = render(<CostIcon className="whatevertheclassname" />);

    // Assert
    expect(screen.getByRole('img', { hidden: true })).toHaveAttribute(
      'class',
      'ocm--cost-icon whatevertheclassname',
    );
    await checkAccessibility(container);
  });
});
