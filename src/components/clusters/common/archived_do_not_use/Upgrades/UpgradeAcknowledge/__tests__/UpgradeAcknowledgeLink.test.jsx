import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import UpgradeAcknowledgeLink from '../UpgradeAcknowledgeLink/UpgradeAcknowledgeLink';

describe('<UpgradeAcknowledgeLink>', () => {
  it('should show nothing if there is not unmet acknowledgements', () => {
    const { container } = render(
      <UpgradeAcknowledgeLink clusterId="myClusterId" hasAcks={false} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('should show link if has unmet acknowledgements', async () => {
    const { container } = render(<UpgradeAcknowledgeLink clusterId="myClusterId" hasAcks />);

    expect(screen.getByRole('link', { name: 'Warning Approval required' })).toHaveAttribute(
      'href',
      '/openshift/details/myClusterId#updateSettings',
    );
    await checkAccessibility(container);
  });
});
