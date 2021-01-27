import React from 'react';
import { shallow } from 'enzyme';
import { Table } from '@patternfly/react-table';

import CloudTab from '../CloudTab';

describe('<CloudTab />', () => {
  const wrapper = shallow(<CloudTab hasOSDQuota />);
  it('should render correctly with quota', () => {
    expect(wrapper.find(Table).length).toEqual(3);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly without quota', () => {
    wrapper.setProps({ hasOSDQuota: false });
    expect(wrapper.find(Table).length).toEqual(2);
    expect(wrapper).toMatchSnapshot();
  });
});
