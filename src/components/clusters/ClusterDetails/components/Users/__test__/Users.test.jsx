import React from 'react';
import { shallow } from 'enzyme';

import { initialState } from '../UsersReducer';
import { stateWithUsers } from './Users.fixtures';
import Users from '../Users';

describe('<Users />', () => {
  it('should render without users', () => {
    const getUsers = jest.fn();
    const wrapper = shallow(<Users
      clusterID="fake id"
      getUsers={getUsers}
      deleteUser={jest.fn()}
      addUser={jest.fn()}
      clusterGroupUsers={initialState.groupUsers}
      addUserResponse={initialState.addUserResponse}
      deleteUserResponse={initialState.deleteUserResponse}
    />);
    expect(wrapper).toMatchSnapshot();
    expect(getUsers).toHaveBeenCalledWith('fake id', 'dedicated-admins');
  });

  describe('with users', () => {
    let deleteUser;
    let getUsers;
    let wrapper;

    beforeEach(() => {
      deleteUser = jest.fn();
      getUsers = jest.fn();

      wrapper = shallow(<Users
        clusterID="fake id"
        getUsers={deleteUser}
        deleteUser={deleteUser}
        addUser={jest.fn()}
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

    it('should call delete user when a user is deleted', () => {
      wrapper.find('Button').at(2).simulate('click');
      expect(deleteUser).toHaveBeenCalledWith('fake id', 'dedicated-admins', 'user_name');
    });
  });
});
