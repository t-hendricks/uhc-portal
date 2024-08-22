import AdvancedClusterSecurityLogo from '~/styles/images/AdvancedClusterSecurityForKubernetesLogo.svg';
import { checkAccessibility, render, screen } from '~/testUtils';

import AdvancedClusterSecurityDrawerPanelHead from '../../components/common/DrawerPanelContents/AdvancedClusterSecurity/DrawerPanelHead';

import '@testing-library/jest-dom';

const TITLE = 'Advanced Cluster Security for Kubernetes';

describe('<AdvancedClusterSecurityDrawerPanelHead />', () => {
  it('renders elements', async () => {
    // Arrange
    const { container } = render(AdvancedClusterSecurityDrawerPanelHead);

    // Assert
    const title = screen.getByTestId('drawer-panel-content__title');
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent(TITLE);

    const logo = screen.getByTestId(`${TITLE}-drawer-panel-content__logo`);
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', AdvancedClusterSecurityLogo);
    expect(logo).toHaveAttribute('alt', `${TITLE} logo`);

    expect(screen.getByText(/by Red Hat/i)).toBeInTheDocument();

    const button = screen.getByText('Start free trial');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute(
      'href',
      'https://www.redhat.com/en/technologies/cloud-computing/openshift/advanced-cluster-security-kubernetes/trial',
    );

    await checkAccessibility(container);
  });
});
