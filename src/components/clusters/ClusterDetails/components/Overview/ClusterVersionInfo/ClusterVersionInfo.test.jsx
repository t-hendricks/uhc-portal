import * as React from 'react';
import { screen } from '@testing-library/dom';
import ClusterVersionInfo from './ClusterVersionInfo';
import fixtures from '../../../__test__/ClusterDetails.fixtures';
import { mockRestrictedEnv, render } from '../../../../../../testUtils';

describe('<ClusterVersionInfo />', () => {
  describe('in restricted env', () => {
    const isRestrictedEnv = mockRestrictedEnv();
    afterAll(() => {
      isRestrictedEnv.mockReturnValue(false);
    });
    it('does not render update link', async () => {
      const props = {
        cluster: {
          ...fixtures.clusterDetails.cluster,
          version: {
            ...fixtures.clusterDetails.cluster.version,
            available_upgrades: ['foo'],
          },
          canEdit: true,
        },
        schedules: {
          items: [],
        },
        getSchedules: () => {},
        clearSchedulesResponse: () => {},
      };
      const { rerender } = render(<ClusterVersionInfo {...props} />);
      expect(screen.queryByText('Update')).toBeInTheDocument();

      isRestrictedEnv.mockReturnValueOnce(true);
      rerender(<ClusterVersionInfo {...props} />);
      expect(screen.queryByText('Update')).not.toBeInTheDocument();
    });
  });
});
