import React from 'react';
import { shallow } from 'enzyme';

import { InstallCluster } from './InstallCluster';

describe('<InstallCluster />', () => {
  it('renders', () => {
    const dispatch = jest.fn();
    const wrapper = shallow(<InstallCluster token={{ }} dispatch={dispatch} />);

    expect(wrapper).toMatchSnapshot();
  });
});
