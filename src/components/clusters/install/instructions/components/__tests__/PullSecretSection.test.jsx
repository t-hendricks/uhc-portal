import React from 'react';
import { shallow } from 'enzyme';

import PullSecretSection from '../PullSecretSection';

describe('<PullSecretSection />', () => {
  describe('with token', () => {
    const token = { auths: { foo: 'bar' } };
    const wrapper = shallow(<PullSecretSection token={token} />);

    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('with error', () => {
    const token = { error: 'my error' };
    const wrapper = shallow(<PullSecretSection token={token} />);

    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
