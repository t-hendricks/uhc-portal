import React from 'react';
import { CompatRouter } from 'react-router-dom-v5-compat';
import { screen, render, userEvent, checkAccessibility, TestRouter } from '../../../testUtils';
import CreateClusterPage from './CreateClusterPage';

describe('<CreateClusterPage />', () => {
  const getOrganizationAndQuota = jest.fn();
  const getAuthToken = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  const organization = {
    details: null,
    error: false,
    errorMessage: '',
    pending: false,
    fulfilled: false,
  };

  const props = {
    getOrganizationAndQuota,
    getAuthToken,
    hasOSDQuota: true,
    hasOSDTrialQuota: true,
    rosaCreationWizardFeature: false,
    organization: { ...organization, fulfilled: true },
    token: {},
    assistedInstallerFeature: false,
  };

  it.skip('is accessible', async () => {
    const { container } = render(
      <TestRouter>
        <CompatRouter>
          <CreateClusterPage {...props} activeTab="" />
        </CompatRouter>
      </TestRouter>,
    );
    await checkAccessibility(container);
  });

  describe('Tabs rendered correctly', () => {
    it.each([
      ['cloud', 'Cloud'],
      ['datacenter', 'Datacenter'],
      ['local', 'Local'],
    ])('renders correct tab when %s', async (tabKey, tabValue) => {
      const { rerender } = render(
        <TestRouter>
          <CompatRouter>
            <CreateClusterPage {...props} activeTab="" />
          </CompatRouter>
        </TestRouter>,
      );
      await userEvent.click(screen.getByRole('tab', { name: tabValue }));
      rerender(
        <TestRouter>
          <CompatRouter>
            <CreateClusterPage {...props} activeTab={tabKey} />
          </CompatRouter>
        </TestRouter>,
      );
      expect(screen.getByRole('tab', { name: tabValue })).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('User with no quota', () => {
    it('should render', async () => {
      render(
        <TestRouter>
          <CompatRouter>
            <CreateClusterPage
              hasOSDQuota={false}
              hasOSDTrialQuota={false}
              getOrganizationAndQuota={getOrganizationAndQuota}
              organization={{ ...organization, fulfilled: true }}
              token={{}}
              getAuthToken={getAuthToken}
              osdTrialFeature={false}
            />
          </CompatRouter>
        </TestRouter>,
      );
      expect(
        await screen.findByText('Select an OpenShift cluster type to create'),
      ).toBeInTheDocument();
    });
  });

  describe('Quota not fetched yet', () => {
    it('should fetch quota', () => {
      render(
        <TestRouter>
          <CompatRouter>
            <CreateClusterPage
              hasOSDQuota={false}
              hasOSDTrialQuota={false}
              getOrganizationAndQuota={getOrganizationAndQuota}
              organization={{ ...organization, fulfilled: false }}
              token={{}}
              activeTab=""
              getAuthToken={getAuthToken}
              osdTrialFeature={false}
            />
          </CompatRouter>
        </TestRouter>,
      );
      expect(getOrganizationAndQuota).toBeCalled();
    });
  });
});
