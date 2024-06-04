import React from 'react';

import { checkAccessibility, render, screen, TestRouter } from '~/testUtils';

import ArchivedClusterList from '../../../ArchivedClusterList';

import * as Fixtures from './ArchivedClusterList.fixtures';

describe('<ArchivedClusterList />', () => {
  describe('ArchivedClusterList', () => {
    it.skip('is accessible', async () => {
      // This fails because there are two pagination area with role
      // that do not have unique accessible labels
      const { container } = render(
        <TestRouter>
          <ArchivedClusterList
            viewOptions={{
              flags: {},
              fields: {},
              sorting: {
                sortIndex: 0,
                isAscending: true,
                sortField: 'name',
              },
            }}
            {...Fixtures}
          />
        </TestRouter>,
      );
      expect(await screen.findByRole('grid')).toBeInTheDocument();
      await checkAccessibility(container);
    });
  });
});
