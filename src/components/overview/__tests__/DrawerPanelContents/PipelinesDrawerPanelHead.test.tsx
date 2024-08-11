import RedHatOpenShiftPipelinesLogo from '~/styles/images/RedHatOpenShiftPipelinesLogo.svg';
import { checkAccessibility, render, screen } from '~/testUtils';

import PipelinesDrawerPanelHead from '../../components/RecommendedOperatorsCards/DrawerPanelContents/Pipelines/DrawerPanelHead';

import '@testing-library/jest-dom';

const TITLE = 'Red Hat OpenShift Pipelines';

describe('PipelinesDrawerPanelHead', () => {
  it('renders elements', async () => {
    const { container } = render(PipelinesDrawerPanelHead);

    const title = screen.getByTestId('drawer-panel-content__title');
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent(TITLE);

    const logo = screen.getByTestId(`${TITLE}-drawer-panel-content__logo`);
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', RedHatOpenShiftPipelinesLogo);
    expect(logo).toHaveAttribute('alt', `${TITLE} logo`);

    expect(screen.getByText(/by Red Hat/i)).toBeInTheDocument();

    await checkAccessibility(container);
  });
});
