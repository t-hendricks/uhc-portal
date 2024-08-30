import RedHatOpenShiftGitOpsLogo from '~/styles/images/RedHatOpenShiftGitOpsLogo.svg';
import { checkAccessibility, render, screen } from '~/testUtils';

import GitopsDrawerPanelHead from '../../components/RecommendedOperatorsCards/DrawerPanelContents/Gitops/DrawerPanelHead';

import '@testing-library/jest-dom';

const TITLE = 'Red Hat OpenShift GitOps';

describe('GitopsDrawerPanelHead', () => {
  it('renders elements', async () => {
    const { container } = render(GitopsDrawerPanelHead);

    const title = screen.getByTestId('drawer-panel-content__title');
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent(TITLE);

    const logo = screen.getByTestId(`${TITLE}-drawer-panel-content__logo`);
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', RedHatOpenShiftGitOpsLogo);
    expect(logo).toHaveAttribute('alt', `${TITLE} logo`);

    expect(screen.getByText(/by Red Hat/i)).toBeInTheDocument();

    await checkAccessibility(container);
  });
});
