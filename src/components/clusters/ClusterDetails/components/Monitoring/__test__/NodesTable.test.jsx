import React from 'react';
import { shallow } from 'enzyme';

import NodesTable from '../components/NodesTable';

describe('<ClusterHealthCard />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<NodesTable />);
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
