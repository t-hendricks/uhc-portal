import React from 'react';

import { render, checkAccessibility, screen, within } from '~/testUtils';
import AddOnsFailedBox from '../AddOnsDrawerFailedBox';

describe('<AddOnsFailedBox />', () => {
  const props = { installedAddOn: { state: 'failed', state_description: 'failed message' } };

  it('is accessible', async () => {
    const { container } = render(<AddOnsFailedBox {...props} />);

    await checkAccessibility(container);
  });

  it('should render alert box', () => {
    render(<AddOnsFailedBox {...props} />);

    expect(
      within(screen.getByRole('alert')).getByText('Add-on failed', { exact: false }),
    ).toBeInTheDocument();
    expect(within(screen.getByRole('alert')).getByText('failed message')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveTextContent('Contact support');
  });

  it('should render null if state is not failed', () => {
    const installedProps = {
      installedAddOn: { state: 'ready' },
    };
    const { container } = render(<AddOnsFailedBox {...installedProps} />);
    expect(container).toBeEmptyDOMElement();
  });
});
