import React from 'react';
import { shallow } from 'enzyme';

import ClusterListEmptyState from './ClusterListEmptyState';

describe('<ClusterListEmptyState />', () => {
  let onClickFunc;
  let wrapper;
  beforeEach(() => {
    onClickFunc = jest.fn();
    wrapper = shallow(<ClusterListEmptyState showCreationForm={onClickFunc} />);
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('calls showCreationForm when needed', () => {
    wrapper.find('Button').at(1).simulate('click');
    expect(onClickFunc).toBeCalled();
  });
});
