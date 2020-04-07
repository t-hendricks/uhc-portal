import React from 'react';
import { shallow } from 'enzyme';

import { initialState } from '../UsersReducer';
import { stateWithUsers } from './Users.fixtures';
import UsersSection from '../UsersSection';

import { clusterDetails } from '../../../../__test__/ClusterDetails.fixtures';

describe('<Users />', () => {
  it('should render without users', () => {
    const getUsers = jest.fn();
    const wrapper = shallow(<UsersSection
      cluster={clusterDetails.cluster}
      getUsers={getUsers}
      deleteUser={jest.fn()}
      addUser={jest.fn()}
      clearUsersResponses={jest.fn()}
      clusterGroupUsers={initialState.groupUsers}
      addUserResponse={initialState.addUserResponse}
      deleteUserResponse={initialState.deleteUserResponse}
    />);
    expect(wrapper).toMatchSnapshot();
    expect(getUsers).toHaveBeenCalledWith(clusterDetails.cluster.id, ['dedicated-admins']);
  });

  describe('with users', () => {
    let deleteUser;
    let getUsers;
    let wrapper;

    beforeEach(() => {
      deleteUser = jest.fn();
      getUsers = jest.fn();

      wrapper = shallow(<UsersSection
        cluster={clusterDetails.cluster}
        getUsers={deleteUser}
        deleteUser={deleteUser}
        addUser={jest.fn()}
        clearUsersResponses={jest.fn()}
        clusterGroupUsers={stateWithUsers}
        addUserResponse={initialState.addUserResponse}
        deleteUserResponse={initialState.deleteUserResponse}
      />);
    });

    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should not call getUsers when it has users', () => {
      expect(getUsers).not.toBeCalled();
    });
  });
});
