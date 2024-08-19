import React from 'react';
import { CompatRouter } from 'react-router-dom-v5-compat';

import { defaultSubscription } from '~/components/clusters/common/__tests__/clusterStates.fixtures';
import { checkAccessibility, render, screen, TestRouter } from '~/testUtils';
import { SubscriptionCommonFields } from '~/types/accounts_mgmt.v1';

import { normalizedProducts } from '../../../../../common/subscriptionTypes';
import TransferClusterOwnershipInfo from '../TransferClusterOwnershipInfo';

describe('<TransferClusterOwnershipInfo />', () => {
  it.each([
    ['undefined subscription', undefined],
    ['empty subscription', {}],
    ['not allowed product', { plan: { type: normalizedProducts.ANY } }],
    [
      'allowed product but not released',
      { plan: { type: normalizedProducts.OCP }, released: false },
    ],
  ])('%p', async (title, subscription) => {
    // Act
    const { container } = render(
      <TestRouter>
        <CompatRouter>
          <TransferClusterOwnershipInfo
            subscription={{ ...defaultSubscription, ...subscription }}
          />
        </CompatRouter>
      </TestRouter>,
    );

    // Assert
    await checkAccessibility(container);
    expect(container).toBeEmptyDOMElement();
  });

  it('properly renders', async () => {
    // Arrange
    const subscription = { plan: { type: normalizedProducts.OCP }, released: true };

    // Act
    const { container } = render(
      <TestRouter>
        <CompatRouter>
          <TransferClusterOwnershipInfo
            subscription={{ ...defaultSubscription, ...subscription }}
          />
        </CompatRouter>
      </TestRouter>,
    );

    // Assert
    await checkAccessibility(container);
    expect(container).not.toBeEmptyDOMElement();

    expect(screen.getByTestId('external-link')).toBeInTheDocument();
    expect(screen.queryByTestId('link')).not.toBeInTheDocument();
  });

  it('properly renders for disconnected status', async () => {
    // Arrange
    const subscription = {
      plan: { type: normalizedProducts.OCP },
      released: true,
      status: SubscriptionCommonFields.status.DISCONNECTED,
    };

    // Act
    const { container } = render(
      <TestRouter>
        <CompatRouter>
          <TransferClusterOwnershipInfo
            subscription={{ ...defaultSubscription, ...subscription }}
          />
        </CompatRouter>
      </TestRouter>,
    );

    // Assert
    await checkAccessibility(container);
    expect(container).not.toBeEmptyDOMElement();

    expect(screen.getByTestId('link')).toBeInTheDocument();
    expect(screen.queryByTestId('external-link')).not.toBeInTheDocument();
  });
});
