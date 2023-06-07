import React from 'react';
import { shallow } from 'enzyme';

import NodeCountInput from './NodeCountInput';
import * as quotaSelectors from '../quotaSelectors';
import { normalizedProducts, billingModels } from '../../../../common/subscriptionTypes';
import { getMinNodesRequired } from '~/components/clusters/ClusterDetails/components/MachinePools/machinePoolsHelper';

const baseProps = (isByoc = false, isMultiAz = false) => ({
  isDisabled: false,
  label: 'compute nodes',
  currentNodeCount: 4,
  quota: {},
  machineTypesByID: {
    fake: { id: 'fake', generic_name: 'fake' },
  },
  input: {
    name: 'compute-nodes',
    onChange: jest.fn(),
  },
  cloudProviderID: 'aws',
  product: normalizedProducts.OSD,
  billingModel: billingModels.STANDARD,
  minNodes: getMinNodesRequired(true, isByoc, isMultiAz),
});

describe('<NodeCountInput>', () => {
  let mockAvailableNodes;
  beforeEach(() => {
    mockAvailableNodes = jest.spyOn(quotaSelectors, 'availableNodesFromQuota');
  });
  afterEach(() => {
    mockAvailableNodes.mockRestore();
  });

  describe('Single AZ', () => {
    it('renders with no quota', () => {
      const wrapper = shallow(<NodeCountInput {...baseProps()} />);
      expect(wrapper).toMatchSnapshot();
      const formSelectProps = wrapper.find('FormSelect').props();
      expect(formSelectProps.isDisabled).toBeFalsy();
    });

    it('renders with some quota', () => {
      mockAvailableNodes.mockReturnValue(10);
      const wrapper = shallow(<NodeCountInput {...baseProps()} machineType="fake" />);
      expect(wrapper).toMatchSnapshot();
      expect(wrapper.find('FormSelect').props().isDisabled).toBeFalsy();
    });

    it('renders with extremely high quota (should only allow up to MAX_NODES)', () => {
      mockAvailableNodes.mockReturnValue(10000);
      const wrapper = shallow(<NodeCountInput {...baseProps()} machineType="fake" />);
      expect(wrapper).toMatchSnapshot();
      expect(wrapper.find('FormSelect').props().isDisabled).toBeFalsy();
    });

    it('correctly handle machineType switching & default value', () => {
      mockAvailableNodes.mockReturnValue(10);
      const onChange = jest.fn();
      const inputProps = { ...baseProps().input, onChange };
      const wrapper = shallow(
        <NodeCountInput {...baseProps()} input={inputProps} machineType="fake" />,
      );
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

    describe('BYOC', () => {
      it('renders with quota granted but insufficient amount', () => {
        mockAvailableNodes.mockReturnValue(0);
        const wrapper = shallow(<NodeCountInput {...baseProps(true)} isByoc machineType="" />);
        expect(wrapper).toMatchSnapshot();
        expect(wrapper.find('FormSelect').props().isDisabled).toBeTruthy();
      });

      describe('and is editing cluster', () => {
        it('renders enabled', () => {
          mockAvailableNodes.mockReturnValue(0);
          const wrapper = shallow(
            <NodeCountInput {...baseProps(true)} isByoc machineType="fake" isEditingCluster />,
          );
          expect(wrapper).toMatchSnapshot();
          expect(wrapper.find('FormSelect').props().isDisabled).toBeFalsy();
        });
      });

      describe('and is editing a machine pool', () => {
        it('renders enabled', () => {
          mockAvailableNodes.mockReturnValue(0);
          const wrapper = shallow(
            <NodeCountInput {...baseProps(true)} isByoc machineType="fake" isMachinePool />,
          );
          expect(wrapper).toMatchSnapshot();
          expect(wrapper.find('FormSelect').props().isDisabled).toBeFalsy();
        });
      });
    });
  });
  describe('Multi AZ', () => {
    it('renders with no quota', () => {
      mockAvailableNodes.mockReturnValue(0);
      const wrapper = shallow(<NodeCountInput {...baseProps(false, true)} isMultiAz />);
      expect(wrapper).toMatchSnapshot();
      const formSelectProps = wrapper.find('FormSelect').props();
      expect(formSelectProps.isDisabled).toBeFalsy();
    });

    it('renders with some quota', () => {
      mockAvailableNodes.mockReturnValue(3);
      const wrapper = shallow(
        <NodeCountInput {...baseProps(false, true)} machineType="fake" isMultiAz />,
      );
      expect(wrapper).toMatchSnapshot();
      expect(wrapper.find('FormSelect').props().isDisabled).toBeFalsy();
    });
  });

  it('correctly handle machineType switching & default value', () => {
    mockAvailableNodes.mockReturnValue(3);
    const onChange = jest.fn();
    const inputProps = { ...baseProps(false, true).input, onChange };
    const wrapper = shallow(
      <NodeCountInput
        {...baseProps(false, true)}
        input={{ ...baseProps(false, true).input, onChange }}
        machineType="fake"
        isMultiAz
      />,
    );
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
        mockAvailableNodes.mockReturnValue(0);
        const wrapper = shallow(
          <NodeCountInput {...baseProps()} isEditingCluster currentNodeCount={6} />,
        );
        expect(wrapper).toMatchSnapshot();
        const formSelectProps = wrapper.find('FormSelect').props();
        expect(formSelectProps.isDisabled).toBeFalsy();
      });
    });
    describe('multiAz', () => {
      it('renders with no quota above current value', () => {
        mockAvailableNodes.mockReturnValue(0);
        const wrapper = shallow(
          <NodeCountInput
            {...baseProps(false, true)}
            isMultiAz
            isEditingCluster
            currentNodeCount={12}
          />,
        );
        expect(wrapper).toMatchSnapshot();
        const formSelectProps = wrapper.find('FormSelect').props();
        expect(formSelectProps.isDisabled).toBeFalsy();
      });
    });
  });
});
