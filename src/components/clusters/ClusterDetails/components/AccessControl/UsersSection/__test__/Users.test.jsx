import React from 'react';
import { shallow } from 'enzyme';

import { initialState } from '../UsersReducer';
import { stateWithUsers } from './Users.fixtures';
import UsersSection from '../UsersSection';

import fixtures from '../../../../__test__/ClusterDetails.fixtures';

describe('<Users />', () => {
  it('should render without users', () => {
    const getUsers = jest.fn();
    const wrapper = shallow(
      <UsersSection
        cluster={fixtures.clusterDetails.cluster}
        getUsers={getUsers}
        deleteUser={jest.fn()}
        addUser={jest.fn()}
        openModal={jest.fn()}
        closeModal={jest.fn()}
        clearUsersResponses={jest.fn()}
        clearAddUserResponses={jest.fn()}
        clusterGroupUsers={{ ...initialState.groupUsers, users: [] }}
        addUserResponse={initialState.addUserResponse}
        deleteUserResponse={initialState.deleteUserResponse}
        hasUsers={false}
        isAddUserModalOpen={false}
        canAddClusterAdmin={false}
        clusterHibernating={false}
        isReadOnly={false}
      />,
    );

    expect(wrapper).toMatchSnapshot();
    expect(getUsers).toHaveBeenCalled();
  });

  describe('with users', () => {
    const getUsers = jest.fn();
    const wrapper = shallow(
      <UsersSection
        cluster={fixtures.clusterDetails.cluster}
        getUsers={getUsers}
        deleteUser={jest.fn()}
        addUser={jest.fn()}
        openModal={jest.fn()}
        closeModal={jest.fn()}
        clearUsersResponses={jest.fn()}
        clearAddUserResponses={jest.fn()}
        clusterGroupUsers={stateWithUsers.groupUsers}
        addUserResponse={initialState.addUserResponse}
        deleteUserResponse={initialState.deleteUserResponse}
        hasUsers
        isAddUserModalOpen={false}
        canAddClusterAdmin={false}
        clusterHibernating={false}
        isReadOnly={false}
      />,
    );

    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
