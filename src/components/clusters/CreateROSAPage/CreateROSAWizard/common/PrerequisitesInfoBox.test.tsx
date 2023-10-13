import React from 'react';
import { checkAccessibility, render, screen, within } from '~/testUtils';
import { MemoryRouter } from 'react-router-dom';
import { PrerequisitesInfoBox } from './PrerequisitesInfoBox';

describe('<PrerequisitesInfoBox} />', () => {
  it('is accessible', async () => {
    const { container } = render(
      <MemoryRouter>
        <PrerequisitesInfoBox />
      </MemoryRouter>,
    );
    await checkAccessibility(container);
  });

  it('provides info and link to ROSA prerequisites page', () => {
    render(
      <MemoryRouter>
        <PrerequisitesInfoBox />
      </MemoryRouter>,
    );

    expect(screen.getByText('Did you complete your prerequisites?')).toBeInTheDocument();
    expect(
      within(screen.getByRole('link')).getByText(
        /Set up Red Hat OpenShift Service on AWS \(ROSA\) page/,
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole('link').getAttribute('href')).toEqual('/getstarted');
  });
});
