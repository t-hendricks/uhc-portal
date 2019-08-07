import React from 'react';
import { shallow } from 'enzyme';

import AlertsTable from '../components/AlertsTable';

describe('<ClusterHealthCard />', () => {
  let wrapper;

  beforeAll(() => {
    wrapper = shallow(<AlertsTable />);
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
