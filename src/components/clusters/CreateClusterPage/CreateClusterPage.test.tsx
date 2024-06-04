import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { CompatRouter } from 'react-router-dom-v5-compat';

import { mockRestrictedEnv, render, screen } from '~/testUtils';

import CreateClusterPage from './CreateClusterPage';

describe('<CreateClusterPage />', () => {
  describe('in Restricted env', () => {
    const isRestrictedEnv = mockRestrictedEnv();

    afterEach(() => {
      isRestrictedEnv.mockReturnValue(false);
    });
    it('renders only Cloud tab', () => {
      const props = {
        organization: {
          fulfilled: true,
        },
        hasOSDQuota: true,
        hasOSDTrialQuota: true,
        rosaCreationWizardFeature: true,
        assistedInstallerFeature: true,
        getOrganizationAndQuota: () => {},
        activeTab: 'Local',
        getAuthToken: () => {},
        token: {},
      };

      const { rerender } = render(
        <MemoryRouter>
          <CompatRouter>
            <CreateClusterPage {...props} />
          </CompatRouter>
        </MemoryRouter>,
      );

      expect(screen.queryByRole('tab', { name: 'Cloud' })).toBeInTheDocument();
      expect(screen.queryByRole('tab', { name: 'Datacenter' })).toBeInTheDocument();
      expect(screen.queryByRole('tab', { name: 'Local' })).toBeInTheDocument();

      isRestrictedEnv.mockReturnValue(true);
      rerender(
        <MemoryRouter>
          <CompatRouter>
            <CreateClusterPage {...props} />
          </CompatRouter>
        </MemoryRouter>,
      );
      expect(screen.queryByRole('tab', { name: 'Cloud' })).toBeInTheDocument();
      expect(screen.queryByRole('tab', { name: 'Datacenter' })).not.toBeInTheDocument();
      expect(screen.queryByRole('tab', { name: 'Local' })).not.toBeInTheDocument();
    });
  });
});
