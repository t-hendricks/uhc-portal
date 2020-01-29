import React from 'react';
import { shallow } from 'enzyme';

import NodeCountInput from './NodeCountInput';

const baseProps = {
  isDisabled: false,
  label: 'compute nodes',
  quota: { },
  input: {
    name: 'compute-nodes',
  },
};

describe('<NodeCountInput>', () => {
  describe('Single AZ', () => {
    it('renders with no quota', () => {
      const wrapper = shallow(<NodeCountInput {...baseProps} />);
      expect(wrapper).toMatchSnapshot();
      const formSelectProps = wrapper.find('FormSelect').props();
      expect(formSelectProps.isDisabled).toBeTruthy();
    });

    it('renders with some quota', () => {
      const wrapper = shallow(<NodeCountInput
        {...baseProps}
        machineType="fake"
        quota={{
          rhInfra: {
            singleAz: {
              fake: 10,
            },
            multiAz: {
              fake: 5,
            },
          },
        }}
      />);
      expect(wrapper).toMatchSnapshot();
      expect(wrapper.find('FormSelect').props().isDisabled).toBeFalsy();
    });
  });
  describe('Multi AZ', () => {
    it('renders with no quota', () => {
      const wrapper = shallow(<NodeCountInput {...baseProps} isMultiAz />);
      expect(wrapper).toMatchSnapshot();
      const formSelectProps = wrapper.find('FormSelect').props();
      expect(formSelectProps.isDisabled).toBeTruthy();
    });

    it('renders with some quota', () => {
      const wrapper = shallow(<NodeCountInput
        {...baseProps}
        machineType="fake"
        isMultiAz
        quota={{
          rhInfra: {
            singleAz: {
              fake: 10,
            },
            multiAz: {
              fake: 9,
            },
          },
        }}
      />);
      expect(wrapper).toMatchSnapshot();
      expect(wrapper.find('FormSelect').props().isDisabled).toBeFalsy();
    });
  });
});
