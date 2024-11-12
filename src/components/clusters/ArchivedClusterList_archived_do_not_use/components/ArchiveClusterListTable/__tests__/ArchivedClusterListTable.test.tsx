import React from 'react';

import { checkAccessibility, render, screen, userEvent } from '~/testUtils';

import ArchivedClusterListTable from '../ArchivedClusterListTable';

import { clusters, openModal, setSorting } from './ArchivedClusterListTable.fixtures';

describe('<ArchivedClusterListTable />', () => {
  describe('ArchivedClusterListTable', () => {
    it('is accessible', async () => {
      const { container } = render(
        <ArchivedClusterListTable
          viewOptions={{
            currentPage: 1,
            totalPages: 5,
            pageSize: 10,
            totalCount: 50,
            filter: {},
            flags: {},
            sorting: {
              sortIndex: 0,
              isAscending: true,
              sortField: 'name',
            },
          }}
          clusters={clusters}
          openModal={openModal}
          setSorting={setSorting}
        />,
      );
      expect(await screen.findByRole('grid')).toBeInTheDocument();
      await checkAccessibility(container);
    });
    it('toggle sorting', async () => {
      render(
        <ArchivedClusterListTable
          viewOptions={{
            currentPage: 1,
            totalPages: 5,
            pageSize: 10,
            totalCount: 50,
            filter: {},
            flags: {},
            sorting: {
              sortIndex: 0,
              isAscending: true,
              sortField: 'name',
            },
          }}
          clusters={clusters}
          setSorting={setSorting}
          openModal={openModal}
        />,
      );

      const nameBtn = screen.getByText('Name');

      await userEvent.click(nameBtn);

      expect(setSorting).toBeCalled();
    });

    it('no clusters found', async () => {
      render(
        <ArchivedClusterListTable
          viewOptions={{
            currentPage: 1,
            totalPages: 5,
            pageSize: 10,
            totalCount: 50,
            filter: {},
            flags: {},
            sorting: {
              sortIndex: 0,
              isAscending: true,
              sortField: 'name',
            },
          }}
          clusters={[]}
          setSorting={setSorting}
          openModal={openModal}
        />,
      );

      expect(screen.getByText('No archived clusters found.')).toBeInTheDocument();
    });

    it('unarchive modal', async () => {
      render(
        <ArchivedClusterListTable
          viewOptions={{
            currentPage: 1,
            totalPages: 5,
            pageSize: 10,
            totalCount: 50,
            filter: {},
            flags: {},
            sorting: {
              sortIndex: 0,
              isAscending: true,
              sortField: 'name',
            },
          }}
          clusters={clusters}
          setSorting={setSorting}
          openModal={openModal}
        />,
      );
      const unarchiveBtn = screen.getByText('Unarchive');

      await userEvent.click(unarchiveBtn);

      expect(openModal).toBeCalled();
    });
  });
});
