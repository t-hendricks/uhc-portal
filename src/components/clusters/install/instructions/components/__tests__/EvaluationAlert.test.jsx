import React from 'react';

import { checkAccessibility, render } from '~/testUtils';

import EvaluationAlert from '../EvaluationAlert';

describe('<EvaluationAler />', () => {
  it('is accessible', async () => {
    const { container } = render(<EvaluationAlert />);

    await checkAccessibility(container);
  });
});
