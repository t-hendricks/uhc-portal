import React from 'react';
import { shallow } from 'enzyme';

import SupportStatus from './SupportStatus';

describe('<SupportStatus />', () => {
  let wrapper;

  describe('should render for every possible support status', () => {
    it('renders for Full Support', () => {
      wrapper = shallow(<SupportStatus status="Full Support" />);
      expect(wrapper).toMatchSnapshot();
    });

    it('renders for Maintenance Support', () => {
      wrapper = shallow(<SupportStatus status="Maintenance Support" />);
      expect(wrapper).toMatchSnapshot();
    });

    it('renders for Extended Update Support', () => {
      wrapper = shallow(<SupportStatus status="Extended Update Support" />);
      expect(wrapper).toMatchSnapshot();
    });

    it('renders for End of Life', () => {
      wrapper = shallow(<SupportStatus status="End of Life" />);
      expect(wrapper).toMatchSnapshot();
    });

    it('renders for an unrecognized status', () => {
      wrapper = shallow(<SupportStatus status="some other status" />);
      expect(wrapper).toMatchSnapshot();
    });
  });
});
