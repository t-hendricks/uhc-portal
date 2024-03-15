import React from 'react';
import { CompatRouter } from 'react-router-dom-v5-compat';
import { screen, checkAccessibility, render, TestRouter } from '~/testUtils';

import { InstructionsChooser } from '../InstructionsChooser';

const mockNavigate = jest.fn();

jest.mock('react-router-dom-v5-compat', () => ({
  ...jest.requireActual('react-router-dom-v5-compat'),
  useNavigate: () => mockNavigate,
}));

const checkForCard = async (url, cardTitle, user) => {
  const instructionCard = screen.getByRole('link', { name: cardTitle });
  expect(instructionCard).toBeInTheDocument();
  await user.click(instructionCard);
  return expect(mockNavigate).lastCalledWith(url);
};

describe('<InstructionsChooser />', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default settings', async () => {
    const ipiPageLink = '/install/aws/installer-provisioned';
    const upiPageLink = '/install/aws/user-provisioned';
    const { container, user } = render(
      <TestRouter>
        <CompatRouter>
          <InstructionsChooser ipiPageLink={ipiPageLink} upiPageLink={upiPageLink} />
        </CompatRouter>
      </TestRouter>,
    );

    await checkAccessibility(container);

    await checkForCard(ipiPageLink, 'Automated CLI-based', user);
    await checkForCard(upiPageLink, 'Full control CLI-based', user);

    const aiLink = screen.queryByRole('link', { name: 'Interactive Recommended Web-based' });
    expect(aiLink).not.toBeInTheDocument();
  });

  it('renders correctly with AI enabled', async () => {
    const aiPageLink = '/assisted-installer/clusters/~new';
    const ipiPageLink = '/install/metal/installer-provisioned';
    const upiPageLink = '/install/metal/user-provisioned';

    const { container, user } = render(
      <TestRouter>
        <CompatRouter>
          <InstructionsChooser
            aiPageLink={aiPageLink}
            ipiPageLink={ipiPageLink}
            upiPageLink={upiPageLink}
          />
        </CompatRouter>
      </TestRouter>,
    );
    await checkAccessibility(container);

    await checkForCard(ipiPageLink, 'Automated CLI-based', user);
    await checkForCard(upiPageLink, 'Full control CLI-based', user);
    await checkForCard(aiPageLink, 'Interactive Recommended Web-based', user);
  });

  it('renders correctly with AI and UPI', async () => {
    const aiPageLink = '/assisted-installer/clusters/~new';
    const ipiPageLink = '/install/metal/installer-provisioned';
    const upiPageLink = '/install/metal/user-provisioned';

    const { container, user } = render(
      <TestRouter>
        <CompatRouter>
          <InstructionsChooser
            aiPageLink={aiPageLink}
            ipiPageLink={ipiPageLink}
            upiPageLink={upiPageLink}
            hideIPI
          />
        </CompatRouter>
      </TestRouter>,
    );

    await checkAccessibility(container);

    await checkForCard(upiPageLink, 'Full control CLI-based', user);
    await checkForCard(aiPageLink, 'Interactive Recommended Web-based', user);

    const ipiLink = screen.queryByRole('link', { name: 'Automated CLI-based' });
    expect(ipiLink).not.toBeInTheDocument();
  });
});
