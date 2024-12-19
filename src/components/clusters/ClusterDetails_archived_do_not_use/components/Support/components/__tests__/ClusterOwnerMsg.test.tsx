import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import ClusterOwnerMsg from '../ClusterOwnerMsg';

describe('<ClusterOwnerMsg />', () => {
  it('is accessible.', async () => {
    // Act
    const { container } = render(<ClusterOwnerMsg email="whatever" />);

    // Assert
    await checkAccessibility(container);
  });

  it('empty content', () => {
    // Act
    render(
      <div data-testid="parent-div">
        <ClusterOwnerMsg />
      </div>,
    );

    // Assert
    expect(screen.getByTestId('parent-div').children.length).toBe(0);
  });

  it('check content', () => {
    // Act
    render(<ClusterOwnerMsg email="whatever" />);

    // Assert
    expect(
      screen.getByText(
        /the cluster owner will always receive notifications, at email address <whatever> , in addition to this list of notification contacts\./i,
      ),
    ).toBeInTheDocument();
  });
});
