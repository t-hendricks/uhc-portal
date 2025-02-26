import React from 'react';

import {
  Card,
  CardBody,
  Pagination,
  PaginationVariant,
  SearchInput,
  Spinner,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from '@patternfly/react-core';
import { Table, Tbody, Td, Th, Thead, ThProps, Tr } from '@patternfly/react-table';

import ErrorBox from '~/components/common/ErrorBox';
import { useFetchHtpasswdUsers } from '~/queries/ClusterDetailsQueries/AccessControlTab/UserQueries/useFetchHtpasswdUsers';
import { HtPasswdUser } from '~/types/clusters_mgmt.v1';

import EmptyState from './EmptyState';

type Props = {
  idpId: string;
  clusterId: string;
  region?: string;
};

const HtpasswdDetails = ({ idpId, clusterId, region }: Props) => {
  const { isLoading, users, isError, error } = useFetchHtpasswdUsers(clusterId, idpId, region);

  const [activeSortIndex, setActiveSortIndex] = React.useState<number>(0);
  const [activeSortDirection, setActiveSortDirection] = React.useState<'asc' | 'desc'>('asc');
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(20);
  const [searchValue, setSearchValue] = React.useState('');

  const [filteredUsers, setFilteredUsers] = React.useState(users);

  // Pagination
  const onSetPage = (
    _event: React.MouseEvent | React.KeyboardEvent | MouseEvent,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const onPerPageSelect = (
    _event: React.MouseEvent | React.KeyboardEvent | MouseEvent,
    newPerPage: number,
    newPage: number,
  ) => {
    setPerPage(newPerPage);
    setPage(newPage);
  };

  // Sorting
  const getSortParams = (columnIndex: number): ThProps['sort'] => ({
    sortBy: {
      index: activeSortIndex,
      direction: activeSortDirection,
      defaultDirection: 'asc', // starting sort direction when first sorting a column. Defaults to 'asc'
    },
    onSort: (_event, index, direction) => {
      setActiveSortIndex(index);
      setActiveSortDirection(direction);
    },
    columnIndex,
  });

  // Ensure that the order in the array matches the order of the headers
  const getSortableUserValues = (user: HtPasswdUser) => [user.username];

  const sortUsers = React.useCallback(
    (a: HtPasswdUser, b: HtPasswdUser) => {
      const aValue = getSortableUserValues(a)[activeSortIndex];
      const bValue = getSortableUserValues(b)[activeSortIndex];

      // String sort
      if (activeSortDirection === 'asc') {
        return (aValue as string).localeCompare(bValue as string);
      }
      return (bValue as string).localeCompare(aValue as string);
    },
    [activeSortDirection, activeSortIndex],
  );

  // Filtering
  React.useEffect(() => {
    let newFilteredUsers = [...users];

    if (searchValue !== '') {
      newFilteredUsers = newFilteredUsers.filter((user) => user.username?.includes(searchValue));

      // if current page no longer exists - then go to the last available page

      if (newFilteredUsers.length < (page - 1) * perPage) {
        setPage(Math.floor(newFilteredUsers.length / perPage) || 1);
      }
    }
    setFilteredUsers(newFilteredUsers.sort(sortUsers));
  }, [page, perPage, searchValue, sortUsers, users]);

  const headers = [{ name: 'Username', sortable: true }];

  const headerRow = (
    <Thead>
      <Tr>
        {headers.map((header, index) => (
          <Th key={header.name} sort={header.sortable ? getSortParams(index) : undefined}>
            {header.name}
          </Th>
        ))}
      </Tr>
    </Thead>
  );

  const userRow = (user: HtPasswdUser) => (
    <Tr key={user.id}>
      <Td>{user.username}</Td>
    </Tr>
  );

  if (isLoading) {
    return (
      <Card>
        <CardBody>
          <Spinner className="pf-v5-u-text-align-center" />
        </CardBody>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardBody>
          <ErrorBox
            message="A problem occurred while retrieving htpasswd users"
            response={{
              errorMessage: error?.errorMessage,
              operationID: error?.operationID,
            }}
          />
        </CardBody>
      </Card>
    );
  }

  const startIndex = (page - 1) * perPage;
  const endIndex = page * perPage;

  const paginationProps = {
    itemCount: filteredUsers.length,
    perPage,
    page,
    onSetPage,
    onPerPageSelect,
  };

  return (
    <Card>
      <CardBody>
        <Toolbar>
          <ToolbarContent>
            <ToolbarItem>
              <SearchInput
                placeholder="Filter by username"
                value={searchValue}
                onChange={(_event, value) => setSearchValue(value)}
                onClear={() => setSearchValue('')}
                aria-label="Filter by username"
              />
            </ToolbarItem>
            <ToolbarItem align={{ default: 'alignRight' }} variant="pagination">
              <Pagination {...paginationProps} isCompact aria-label="Pagination top" />
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>

        <Table>
          {headerRow}
          <Tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.slice(startIndex, endIndex).map((user: HtPasswdUser) => userRow(user))
            ) : (
              <Tr>
                <Td colSpan={headers.length}>
                  <EmptyState showClearFilterButton={!!searchValue} resetFilters={setSearchValue} />
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
        <Pagination
          {...paginationProps}
          variant={PaginationVariant.bottom}
          titles={{ paginationAriaLabel: 'Pagination bottom' }}
        />
      </CardBody>
    </Card>
  );
};

export default HtpasswdDetails;
