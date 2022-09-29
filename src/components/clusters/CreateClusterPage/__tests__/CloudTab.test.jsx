import React from 'react';
import { shallow } from 'enzyme';
import { Table } from '@patternfly/react-table';

import CloudTab from '../CloudTab';

describe('<CloudTab />', () => {
  it('should render correctly with quota', () => {
    const wrapper = shallow(<CloudTab hasOSDQuota trialEnabled={false} osdTrialFeature />);

    expect(wrapper.find(Table).length).toEqual(3);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly without quota', () => {
    const wrapper = shallow(<CloudTab hasOSDQuota={false} trialEnabled={false} />);

    expect(wrapper.find(Table).length).toEqual(2);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with OSD Trial quota', () => {
    const wrapper = shallow(<CloudTab hasOSDQuota={false} trialEnabled />);
    expect(wrapper).toMatchSnapshot();
  });
});
