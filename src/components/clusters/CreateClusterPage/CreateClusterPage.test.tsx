import * as React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { mockRestrictedEnv, render } from '~/testUtils';
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
        getAuthToken: () => {},
        token: {},
      };

      const { rerender } = render(
        <MemoryRouter>
          <CreateClusterPage {...props} />
        </MemoryRouter>,
      );

      expect(screen.queryByRole('tab', { name: 'Cloud' })).toBeInTheDocument();
      expect(screen.queryByRole('tab', { name: 'Datacenter' })).toBeInTheDocument();
      expect(screen.queryByRole('tab', { name: 'Local' })).toBeInTheDocument();

      isRestrictedEnv.mockReturnValue(true);
      rerender(
        <MemoryRouter>
          <CreateClusterPage {...props} />
        </MemoryRouter>,
      );
      expect(screen.queryByRole('tab', { name: 'Cloud' })).toBeInTheDocument();
      expect(screen.queryByRole('tab', { name: 'Datacenter' })).not.toBeInTheDocument();
      expect(screen.queryByRole('tab', { name: 'Local' })).not.toBeInTheDocument();
    });
  });
});
