import React from 'react';

import { checkAccessibility, render } from '~/testUtils';

import TelemetryDisclaimer from '../TelemetryDisclaimer';

describe('<TelemetryDisclaimer />', () => {
  it('is accessible', async () => {
    const { container } = render(<TelemetryDisclaimer />);

    await checkAccessibility(container);
  });
});
