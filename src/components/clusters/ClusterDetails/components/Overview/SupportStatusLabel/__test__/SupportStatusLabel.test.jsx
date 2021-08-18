import React from 'react';
import { shallow } from 'enzyme';

import SupportStatusLabel from '../SupportStatusLabel';

const supportStatuses = {
  4.5: 'Full Support',
  4.4: 'Maintainence Support',
  4.3: 'Extended Update Support',
  4.2: 'End Of Life',
  4.1: 'some other status',
};

describe('<SupportStatusLabel />', () => {
  let wrapper;
  let getSupportStatus;
  beforeEach(() => {
    getSupportStatus = jest.fn();
    wrapper = shallow(<SupportStatusLabel getSupportStatus={getSupportStatus} clusterVersion="4.5" />);
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should fetch status on initial mount', () => {
    expect(getSupportStatus).toHaveBeenCalled();
  });

  it('should render skeleton when pending', () => {
    wrapper.setProps({ pending: true });
    expect(wrapper.find('Skeleton').length).toEqual(1);
    expect(wrapper).toMatchSnapshot();
  });

  it('should show N/A when support status is unknown', () => {
    wrapper.setProps({ pending: false, fulfilled: true, supportStatus: {} });
    expect(wrapper).toMatchSnapshot();
  });

  it('should show N/A for a pre-release version', () => {
    wrapper.setProps({ clusterVersion: '4.5.0-0.nightly-2020-07-14-052310' });
    expect(wrapper).toMatchSnapshot();
  });

  describe('should render for every possible support status', () => {
    const props = {
      getSupportStatus,
      fulfilled: true,
      supportStatus: supportStatuses,
    };
    it('renders for Full Support', () => {
      wrapper = shallow(<SupportStatusLabel {...props} clusterVersion="4.5" />);
      expect(wrapper).toMatchSnapshot();
    });

    it('renders for Maintainence Support', () => {
      wrapper = shallow(<SupportStatusLabel {...props} clusterVersion="4.4" />);
      expect(wrapper).toMatchSnapshot();
    });

    it('renders for Extended Update Support', () => {
      wrapper = shallow(<SupportStatusLabel {...props} clusterVersion="4.3" />);
      expect(wrapper).toMatchSnapshot();
    });

    it('renders for End of Life', () => {
      wrapper = shallow(<SupportStatusLabel {...props} clusterVersion="4.2" />);
      expect(wrapper).toMatchSnapshot();
    });

    it('renders for an unrecognized status', () => {
      wrapper = shallow(<SupportStatusLabel {...props} clusterVersion="4.1" />);
      expect(wrapper).toMatchSnapshot();
    });
  });
});
