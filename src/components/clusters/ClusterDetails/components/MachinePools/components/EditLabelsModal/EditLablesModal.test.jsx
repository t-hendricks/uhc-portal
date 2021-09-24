import React from 'react';
import { shallow } from 'enzyme';
import EditLabelsModal from './EditLabelsModal';

describe('<EditLabelsModal />', () => {
  const closeModal = jest.fn();
  const handleSubmit = jest.fn();
  const resetGetMachinePoolsResponse = jest.fn();
  const resetEditLabelsResponse = jest.fn();
  const getMachinePools = jest.fn();
  const change = jest.fn();
  const reset = jest.fn();

  const mockData = {
    data: [
      {
        availability_zones: ['us-east-1a'],
        href: '/api/clusters_mgmt/v1/clusters/cluster-id/machine_pools/mp-with-taints',
        id: 'mp-with-labels',
        instance_type: 'm5.xlarge',
        kind: 'MachinePool',
        replicas: 1,
        labels: { foo: 'bar', foo1: 'bar1', foo2: 'bar2' },
      },
    ],
  };

  const props = {
    closeModal,
    handleSubmit,
    editLabelsResponse: {},
    getMachinePools,
    resetEditLabelsResponse,
    resetGetMachinePoolsResponse,
    machinePoolsList: mockData,
    change,
    reset,
    pristine: true,
    invalid: false,
    clusterId: 'test-id',
  };

  const wrapper = shallow(<EditLabelsModal {...props} />);

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should update labels when changing machine pool', () => {
    const mpField = wrapper.find('Field[name="machinePoolId"]');
    const mockEvent = { target: { value: mockData.data[0].id } };
    mpField.props().onChange(mockEvent, mockEvent.target.value);
    expect(change).toHaveBeenCalledWith('labels', ['foo=bar', 'foo1=bar1', 'foo2=bar2']);
  });
});
