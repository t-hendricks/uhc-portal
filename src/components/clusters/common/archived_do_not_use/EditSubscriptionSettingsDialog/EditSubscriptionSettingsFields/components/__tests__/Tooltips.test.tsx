import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import Tooltips from '../Tooltips';

describe('<Tooltips />', () => {
  const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('is accessible', async () => {
    // Act
    const { container } = render(<Tooltips isShown />);

    // Assert
    await checkAccessibility(container);
  });

  it('is shown', () => {
    // Act
    render(<Tooltips isShown />);

    // Assert
    expect(consoleErrorMock).toHaveBeenCalledTimes(4);
  });

  it('is not shown', () => {
    // Act
    render(
      <div data-testid="parent-div">
        <Tooltips />
      </div>,
    );

    // Assert
    expect(consoleErrorMock).toHaveBeenCalledTimes(0);
    expect(screen.getByTestId('parent-div').children.length).toBe(0);
  });
});
