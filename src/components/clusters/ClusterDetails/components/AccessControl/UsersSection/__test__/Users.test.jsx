import React from 'react';
import { screen, render, checkAccessibility } from '@testUtils';
import { initialState } from '../UsersReducer';
import { stateWithUsers } from './Users.fixtures';
import UsersSection from '../UsersSection';

import fixtures from '../../../../__test__/ClusterDetails.fixtures';

describe('<Users />', () => {
  const getUsers = jest.fn();
  const props = {
    cluster: fixtures.clusterDetails.cluster,
    getUsers,
    deleteUser: jest.fn(),
    addUser: jest.fn(),
    openModal: jest.fn(),
    closeModal: jest.fn(),
    clearUsersResponses: jest.fn(),
    clearAddUserResponses: jest.fn(),
    clusterGroupUsers: { ...initialState.groupUsers, users: [] },
    addUserResponse: initialState.addUserResponse,
    deleteUserResponse: initialState.deleteUserResponse,
    hasUsers: false,
    isAddUserModalOpen: false,
    canAddClusterAdmin: false,
    clusterHibernating: false,
    isReadOnly: false,
  };
  afterEach(() => {
    getUsers.mockClear();
  });
  it('is accessible without users', async () => {
    const { container } = render(<UsersSection {...props} />);
    expect(getUsers).toHaveBeenCalled();
    await checkAccessibility(container);
  });

  describe('with users', () => {
    afterEach(() => {
      getUsers.mockClear();
    });

    it('is accessible', async () => {
      const newProps = { ...props, clusterGroupUsers: stateWithUsers.groupUsers, hasUsers: true };
      const { container } = render(<UsersSection {...newProps} />);
      expect(getUsers).toHaveBeenCalled();
      expect(screen.getAllByRole('cell', { name: 'dedicated-admins' })).toHaveLength(2);
      expect(screen.getAllByRole('cell', { name: 'cluster-admins' })).toHaveLength(2);
      await checkAccessibility(container);
    });
  });
});
