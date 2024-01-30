import React from 'react';
import { render, checkAccessibility } from '~/testUtils';

import TelemetryDisclaimer from '../TelemetryDisclaimer';

describe('<TelemetryDisclaimer />', () => {
  it('is accessible', async () => {
    const { container } = render(<TelemetryDisclaimer />);

    await checkAccessibility(container);
  });
});
