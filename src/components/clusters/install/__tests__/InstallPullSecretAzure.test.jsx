import React from 'react';
import { shallow } from 'enzyme';

import { InstallPullSecretAzure } from '../InstallPullSecretAzure';

describe('InstallPullSecretAzure', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstallPullSecretAzure token={{}} dispatch={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
});
