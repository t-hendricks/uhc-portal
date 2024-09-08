import RedHatOpenShiftServiceMeshLogo from '~/styles/images/RedHatOpenShiftServiceMeshLogo.svg';
import { checkAccessibility, render, screen } from '~/testUtils';

import ServiceMeshDrawerPanelHead from '../../components/common/DrawerPanelContents/ServiceMesh/DrawerPanelHead';

import '@testing-library/jest-dom';

const TITLE = 'Red Hat OpenShift Service Mesh';

describe('ServiceMeshDrawerPanelHead', () => {
  it('renders elements', async () => {
    const { container } = render(ServiceMeshDrawerPanelHead);

    const title = screen.getByTestId('drawer-panel-content__title');
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent(TITLE);

    const logo = screen.getByTestId(`${TITLE}-drawer-panel-content__logo`);
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', RedHatOpenShiftServiceMeshLogo);
    expect(logo).toHaveAttribute('alt', `${TITLE} logo`);

    expect(screen.getByText(/by Red Hat/i)).toBeInTheDocument();

    await checkAccessibility(container);
  });
});
