import React from 'react';
import { render, checkAccessibility } from '~/testUtils';

import TokenErrorAlert from '../TokenErrorAlert';

describe('<TokenErrorAlert />', () => {
  it('is accessible', async () => {
    const { container } = render(<TokenErrorAlert token={{ auths: { foo: 'bar' } }} />);
    await checkAccessibility(container);
  });
});
