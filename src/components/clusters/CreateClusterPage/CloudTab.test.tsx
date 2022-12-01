import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { axe, toHaveNoViolations } from 'jest-axe';
import CloudTab from './CloudTab';

expect.extend(toHaveNoViolations);

describe('CloudTab', () => {
  it('is accessible', async () => {
    const { container } = render(
      <MemoryRouter>
        <CloudTab hasOSDQuota trialEnabled rosaCreationWizardFeature />
      </MemoryRouter>,
    );

    const results = await axe(container);
    screen.debug();
    expect(results).toHaveNoViolations();
  });

  it('matches snapshot', () => {
    const { container } = render(
      <MemoryRouter>
        <CloudTab hasOSDQuota trialEnabled rosaCreationWizardFeature />
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });
});
