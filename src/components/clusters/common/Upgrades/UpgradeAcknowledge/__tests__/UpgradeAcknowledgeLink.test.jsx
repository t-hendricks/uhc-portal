import React from 'react';
import { CompatRouter } from 'react-router-dom-v5-compat';

import { checkAccessibility, render, screen, TestRouter } from '~/testUtils';

import UpgradeAcknowledgeLink from '../UpgradeAcknowledgeLink/UpgradeAcknowledgeLink';

describe('<UpgradeAcknowledgeLink>', () => {
  it('should show nothing if there is not unmet acknowledgements', () => {
    const { container } = render(
      <TestRouter>
        <CompatRouter>
          <UpgradeAcknowledgeLink clusterId="myClusterId" hasAcks={false} />
        </CompatRouter>
      </TestRouter>,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('should show link if has unmet acknowledgements', async () => {
    const { container } = render(
      <TestRouter>
        <CompatRouter>
          <UpgradeAcknowledgeLink clusterId="myClusterId" hasAcks />
        </CompatRouter>
      </TestRouter>,
    );

    expect(screen.getByRole('link', { name: 'Warning Approval required' })).toHaveAttribute(
      'href',
      '/details/myClusterId#updateSettings',
    );
    await checkAccessibility(container);
  });
});
