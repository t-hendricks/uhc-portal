import React from 'react';
import { shallow } from 'enzyme';

import AccessControl from './AccessControl';

describe('<AccessControl />', () => {
  it('should render', () => {
    const wrapper = shallow(
      <AccessControl
        cluster={{ canEdit: true, id: 'fake id' }}
        clusterUrls={{
          console: 'https://console-openshift-console.apps.example.com',
          api: 'https://api.test-liza.wiex.s1.devshift.org:6443',
        }}
        cloudProvider="aws"
      />,
    );
    expect(wrapper).toMatchSnapshot();
  });
});
