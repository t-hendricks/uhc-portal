import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { CompatRouter } from 'react-router-dom-v5-compat';

import { ROSA_HOSTED_CLI_MIN_VERSION } from '~/components/clusters/wizards/rosa/rosaConstants';
import { checkAccessibility, render, screen, within } from '~/testUtils';

import { PrerequisitesInfoBox } from './PrerequisitesInfoBox';

const rosaCLIMessage = new RegExp(
  `Make sure you are using ROSA CLI version ${ROSA_HOSTED_CLI_MIN_VERSION} or above for "Hosted" control plane.`,
);

describe('<PrerequisitesInfoBox} />', () => {
  it('is accessible', async () => {
    const { container } = render(
      <MemoryRouter>
        <CompatRouter>
          <PrerequisitesInfoBox />
        </CompatRouter>
      </MemoryRouter>,
    );
    await checkAccessibility(container);
  });

  it('provides info and link to ROSA prerequisites page', () => {
    render(
      <MemoryRouter>
        <CompatRouter>
          <PrerequisitesInfoBox />
        </CompatRouter>
      </MemoryRouter>,
    );

    expect(screen.getByText('Did you complete your prerequisites?')).toBeInTheDocument();
    expect(within(screen.getByRole('link')).getByText(/Set up ROSA page/)).toBeInTheDocument();
    expect(screen.getByRole('link').getAttribute('href')).toEqual('/create/rosa/getstarted');
  });

  it('shows the ROSA CLI version message by default', () => {
    render(
      <MemoryRouter>
        <CompatRouter>
          <PrerequisitesInfoBox />
        </CompatRouter>
      </MemoryRouter>,
    );

    expect(screen.getByText(rosaCLIMessage)).toBeInTheDocument();
  });

  it('does not show the ROSA CLI version message when "showRosaCliRequirement" is false', () => {
    render(
      <MemoryRouter>
        <CompatRouter>
          <PrerequisitesInfoBox showRosaCliRequirement={false} />
        </CompatRouter>
      </MemoryRouter>,
    );

    expect(screen.queryByText(rosaCLIMessage)).not.toBeInTheDocument();
  });
});
