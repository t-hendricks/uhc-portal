import React from 'react';
import { render, checkAccessibility } from '~/testUtils';

import SubscriptionAndSupport from '../SubscriptionAndSupport';

describe('<SubscriptionAndSupport />', () => {
  it('is accessible', async () => {
    const { container } = render(<SubscriptionAndSupport />);
    await checkAccessibility(container);
  });
});
