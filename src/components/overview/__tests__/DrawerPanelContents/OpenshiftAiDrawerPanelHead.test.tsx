import RedHatOpenShiftAILogo from '~/styles/images/RedHatOpenShiftAILogo.svg';
import { checkAccessibility, render, screen } from '~/testUtils';

import OpenshiftAiDrawerPanelHead from '../../components/common/DrawerPanelContents/OpenshiftAi/DrawerPanelHead';

import '@testing-library/jest-dom';

const TITLE = 'Red Hat OpenShift AI';

describe('<OpenshiftAiDrawerPanelHead />', () => {
  it('renders elements', async () => {
    const { container } = render(OpenshiftAiDrawerPanelHead);

    const title = screen.getByTestId('drawer-panel-content__title');
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent(TITLE);

    const logo = screen.getByTestId(`${TITLE}-drawer-panel-content__logo`);
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', RedHatOpenShiftAILogo);
    expect(logo).toHaveAttribute('alt', `${TITLE} logo`);

    expect(screen.getByText(/by Red Hat/i)).toBeInTheDocument();

    const button = screen.getByText('Start free trial');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute(
      'href',
      'https://www.redhat.com/en/technologies/cloud-computing/openshift/openshift-ai/trial',
    );

    await checkAccessibility(container);
  });
});
