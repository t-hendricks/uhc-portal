import React from 'react';

import { render, checkAccessibility, TestRouter, screen } from '~/testUtils';
import * as Fixtures from './ArchivedClusterListTable.fixtures';
import ArchivedClusterListTable from '../ArchivedClusterListTable';

describe('<ArchivedClusterListTable />', () => {
  describe('ArchivedClusterListTable', () => {
    it('is accessible', async () => {
      const { container } = render(
        <TestRouter>
          <ArchivedClusterListTable
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
