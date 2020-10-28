import React from 'react';
import { shallow } from 'enzyme';

import NodeCountInput from './NodeCountInput';

const baseProps = {
  isDisabled: false,
  label: 'compute nodes',
  quota: { },
  machineTypesByID: {
    fake: { id: 'fake', resource_name: 'fake' },
  },
  input: {
    name: 'compute-nodes',
    onChange: jest.fn(),
  },
};

describe('<NodeCountInput>', () => {
  describe('Single AZ', () => {
    it('renders with no quota', () => {
      const wrapper = shallow(<NodeCountInput {...baseProps} />);
      expect(wrapper).toMatchSnapshot();
      const formSelectProps = wrapper.find('FormSelect').props();
      expect(formSelectProps.isDisabled).toBeFalsy();
    });

    it('renders with some quota', () => {
      const wrapper = shallow(<NodeCountInput
        {...baseProps}
        machineType="fake"
        quota={{
          rhInfra: {
            fake: {
              available: 10,
              cost: 1,
            },
          },
        }}
      />);
      expect(wrapper).toMatchSnapshot();
      expect(wrapper.find('FormSelect').props().isDisabled).toBeFalsy();
    });

    it('renders with extremely high quota (should only allow up to MAX_NODES)', () => {
      const wrapper = shallow(<NodeCountInput
        {...baseProps}
        machineType="fake"
        quota={{
          rhInfra: {
            fake: {
              available: 10000,
              cost: 1,
            },
          },
        }}
      />);
      expect(wrapper).toMatchSnapshot();
      expect(wrapper.find('FormSelect').props().isDisabled).toBeFalsy();
    });

    it('correctly handle machineType swithcing & default value', () => {
      const onChange = jest.fn();
      const inputProps = { ...baseProps.input, onChange };
      const wrapper = shallow(<NodeCountInput
        {...baseProps}
        input={inputProps}
        machineType="fake"
        quota={{
          rhInfra: {
            fake: 10,
          },
        }}
      />);
      // now let's set a higher value and make sure it works...
      wrapper.setProps({ input: { ...inputProps, value: 10 } }, () => {
        // props set, check the value
        expect(wrapper.find('FormSelect').props().value).toEqual(10); // new value
        // Now switch to a new machine type
        wrapper.setProps({ machineType: 'fake2' }, () => {
          // we have no quota for fake2 - value should reset to default
          expect(onChange).toBeCalledWith(4);
        });
      });
    });
  });
  describe('Multi AZ', () => {
    it('renders with no quota', () => {
      const wrapper = shallow(<NodeCountInput {...baseProps} isMultiAz />);
      expect(wrapper).toMatchSnapshot();
      const formSelectProps = wrapper.find('FormSelect').props();
      expect(formSelectProps.isDisabled).toBeFalsy();
    });

    it('renders with some quota', () => {
      const wrapper = shallow(<NodeCountInput
        {...baseProps}
        machineType="fake"
        isMultiAz
        quota={{
          rhInfra: {
            fake: {
              available: 3,
              cost: 1,
            },
          },
        }}
      />);
      expect(wrapper).toMatchSnapshot();
      expect(wrapper.find('FormSelect').props().isDisabled).toBeFalsy();
    });
  });

  it('correctly handle machineType swithcing & default value', () => {
    const onChange = jest.fn();
    const inputProps = { ...baseProps.input, onChange };
    const wrapper = shallow(<NodeCountInput
      {...baseProps}
      input={{ ...baseProps.input, onChange }}
      machineType="fake"
      isMultiAz
      quota={{
        rhInfra: {
          fake: 3,
        },
      }}
    />);
    // now let's set a higher value and make sure it works...
    wrapper.setProps({ input: { ...inputProps, value: 15 } }, () => {
      // props set, check the value
      expect(wrapper.find('FormSelect').props().value).toEqual(15); // new value
      // Now switch to a new machine type
      wrapper.setProps({ machineType: 'fake2' }, () => {
        // we have no quota for fake2 - value should reset to default
        expect(onChange).toBeCalledWith(9);
      });
    });
  });

  describe('scaling dialog behavior', () => {
    describe('singleAZ', () => {
      it('renders with no quota above current value', () => {
        const wrapper = shallow(
          <NodeCountInput {...baseProps} isEditingCluster currentNodeCount={6} />,
        );
        expect(wrapper).toMatchSnapshot();
        const formSelectProps = wrapper.find('FormSelect').props();
        expect(formSelectProps.isDisabled).toBeFalsy();
      });
    });
    describe('multiAz', () => {
      it('renders with no quota above current value', () => {
        const wrapper = shallow(
          <NodeCountInput {...baseProps} isMultiAz isEditingCluster currentNodeCount={12} />,
        );
        expect(wrapper).toMatchSnapshot();
        const formSelectProps = wrapper.find('FormSelect').props();
        expect(formSelectProps.isDisabled).toBeFalsy();
      });
    });
  });
});
