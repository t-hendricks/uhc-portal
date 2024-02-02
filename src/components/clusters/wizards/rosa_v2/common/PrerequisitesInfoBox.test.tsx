import React from 'react';
import { checkAccessibility, render, screen, within } from '~/testUtils';
import { MemoryRouter } from 'react-router-dom';
import { ROSA_HOSTED_CLI_MIN_VERSION } from '~/components/clusters/wizards/rosa_v1/rosaConstants';
import { PrerequisitesInfoBox } from './PrerequisitesInfoBox';

const rosaCLIMessage = new RegExp(
  `Make sure you are using ROSA CLI version ${ROSA_HOSTED_CLI_MIN_VERSION} or above for "Hosted" control plane.`,
);

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
    expect(within(screen.getByRole('link')).getByText(/Set up ROSA page/)).toBeInTheDocument();
    expect(screen.getByRole('link').getAttribute('href')).toEqual('/getstarted');
  });

  it('shows the ROSA CLI version message by default', () => {
    render(
      <MemoryRouter>
        <PrerequisitesInfoBox />
      </MemoryRouter>,
    );

    expect(screen.getByText(rosaCLIMessage)).toBeInTheDocument();
  });

  it('does not show the ROSA CLI version message when "showRosaCliRequirement" is false', () => {
    render(
      <MemoryRouter>
        <PrerequisitesInfoBox showRosaCliRequirement={false} />
      </MemoryRouter>,
    );

    expect(screen.queryByText(rosaCLIMessage)).not.toBeInTheDocument();
  });
});
