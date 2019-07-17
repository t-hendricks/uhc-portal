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

  it('should call saveUser when button is pressed', () => {
    wrapper.find('TextInput').at(0).simulate('change', 'hello');
    wrapper.find('Button').simulate('click');
    expect(saveUser).toHaveBeenCalledWith('fake id', 'dedicated-admins', 'hello');
  });
});
