import React from 'react';
import { render, screen, checkAccessibility, TestRouter } from '~/testUtils';

import UpgradeAcknowledgeLink from '../UpgradeAcknowledgeLink/UpgradeAcknowledgeLink';

describe('<UpgradeAcknowledgeLink>', () => {
  it('should show nothing if there is not unmet acknowledgements', () => {
    const { container } = render(
      <UpgradeAcknowledgeLink clusterId="myClusterId" hasAcks={false} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('should show link if has unmet acknowledgements', async () => {
    const { container } = render(
      <TestRouter>
        <UpgradeAcknowledgeLink clusterId="myClusterId" hasAcks />
      </TestRouter>,
    );

    expect(screen.getByRole('link', { name: 'Warning Approval required' })).toHaveAttribute(
      'href',
      '/details/myClusterId#updateSettings',
    );
    await checkAccessibility(container);
  });
});
