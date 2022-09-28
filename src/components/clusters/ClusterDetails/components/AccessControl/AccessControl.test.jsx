import React from 'react';
import { shallow } from 'enzyme';

import AccessControl from './AccessControl';

describe('<AccessControl />', () => {
  it('should render', () => {
    const wrapper = shallow(
      <AccessControl
        cluster={{ canEdit: true, id: 'fake id' }}
        clusterConsoleURL="https://console-openshift-console.apps.example.com"
        cloudProvider="aws"
      />,
    );
    expect(wrapper).toMatchSnapshot();
  });
});
