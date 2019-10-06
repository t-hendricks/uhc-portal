import React from 'react';
import { shallow } from 'enzyme';

import UserInputForm from '../UserInputForm';

describe('<UserInputForm />', () => {
  let wrapper;
  let saveUser;

  beforeEach(() => {
    saveUser = jest.fn();
    wrapper = shallow(<UserInputForm
      clusterID="fake id"
      pending={false}
      saveUser={saveUser}
    />);
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('reject admin user id with slash', () => {
    const textInput = wrapper.find('TextInput').at(0);
    textInput.simulate('change', 'aaa/bbb');
    const btn = wrapper.find('Button');
    btn.simulate('click');
    expect(btn.at(0).props().isDisabled).toBeTruthy();
    expect(saveUser).not.toHaveBeenCalled();
  });

  it('should call saveUser when button is pressed', () => {
    wrapper.find('TextInput').at(0).simulate('change', 'hello');
    wrapper.find('Button').simulate('click');
    expect(saveUser).toHaveBeenCalledWith('fake id', 'dedicated-admins', 'hello');
  });
});
