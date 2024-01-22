import React from 'react';
import { render, checkAccessibility } from '~/testUtils';

import EvaluationAlert from '../EvaluationAlert';

describe('<EvaluationAler />', () => {
  it('is accessible', async () => {
    const { container } = render(<EvaluationAlert />);

    await checkAccessibility(container);
  });
});
