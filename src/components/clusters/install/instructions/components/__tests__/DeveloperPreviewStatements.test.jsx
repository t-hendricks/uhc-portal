import React from 'react';
import { render, checkAccessibility } from '~/testUtils';

import DeveloperPreviewStatements from '../DeveloperPreviewStatements';

describe('<DeveloperPreviewStatements />', () => {
  it('is accessible', async () => {
    const { container } = render(<DeveloperPreviewStatements />);
    await checkAccessibility(container);
  });
});
