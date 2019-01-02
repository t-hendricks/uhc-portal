import React from 'react';
import { shallow } from 'enzyme';

import RefreshButton from './RefreshButton';

describe('<RefreshButton />', () => {
  let onClickFunc;
  let wrapper;
  beforeEach(() => {
    onClickFunc = jest.fn();
    wrapper = shallow(<RefreshButton id="id" refreshFunc={onClickFunc} />);
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('calls refreshFunc when clicked', () => {
    wrapper.find('Button').simulate('click');
    expect(onClickFunc).toBeCalled();
  });
});
