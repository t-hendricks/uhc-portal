import React from 'react';
import { shallow } from 'enzyme';
import ClusterListActions from '../ClusterListActions';

jest.mock('~/redux/hooks/useGlobalState', () => ({
  useGlobalState: () => {},
}));

describe('<ClusterListActions />', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<ClusterListActions />);
    expect(wrapper).toMatchSnapshot();
  });
});
