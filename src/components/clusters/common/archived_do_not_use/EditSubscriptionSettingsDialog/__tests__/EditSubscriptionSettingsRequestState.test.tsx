import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';
import { ErrorState } from '~/types/types';

import EditSubscriptionSettingsRequestState from '../EditSubscriptionSettingsRequestState';

describe('<EditSubscriptionSettingsRequestState />', () => {
  it('is accessible', async () => {
    // Act
    const { container } = render(
      <EditSubscriptionSettingsRequestState
        requestState={{ error: '' } as unknown as ErrorState}
        onFulfilled={jest.fn()}
      />,
    );

    // Assert
    await checkAccessibility(container);
  });

  it('empty content', () => {
    // Act
    render(
      <div data-testid="parent-div">
        <EditSubscriptionSettingsRequestState
          requestState={{} as unknown as ErrorState}
          onFulfilled={jest.fn()}
        />
      </div>,
    );

    // Assert
    expect(screen.getByTestId('parent-div').children.length).toBe(0);
  });

  it('fulfilled request state', () => {
    // Arrange
    const onFulfilledMock = jest.fn();
    const { rerender } = render(
      <EditSubscriptionSettingsRequestState
        requestState={{} as unknown as ErrorState}
        onFulfilled={onFulfilledMock}
      />,
    );
    expect(onFulfilledMock).toHaveBeenCalledTimes(0);

    // Act
    rerender(
      <EditSubscriptionSettingsRequestState
        requestState={{ fulfilled: true } as unknown as ErrorState}
        onFulfilled={onFulfilledMock}
      />,
    );

    // Assert
    expect(onFulfilledMock).toHaveBeenCalledTimes(1);
    expect(onFulfilledMock).toHaveBeenCalledWith();
  });
});
