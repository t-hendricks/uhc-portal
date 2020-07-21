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
  beforeAll(() => {
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

  it('should show blue label when status is still supported', () => {
    wrapper.setProps({ supportStatus: supportStatuses });
    const labelProps = wrapper.find('Label').props();
    expect(labelProps).toMatchObject({ color: 'blue', variant: 'outline' });
    expect(wrapper).toMatchSnapshot();
  });

  it('should show red label when status is not supported', () => {
    wrapper.setProps({ clusterVersion: '4.2' });
    const labelProps = wrapper.find('Label').props();
    expect(labelProps).toMatchObject({ color: 'red' });
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
