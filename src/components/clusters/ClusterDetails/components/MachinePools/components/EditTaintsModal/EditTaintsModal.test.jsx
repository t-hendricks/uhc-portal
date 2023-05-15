import React from 'react';
import { shallow } from 'enzyme';

import EditTaintsModal from './EditTaintsModal';

describe('<EditTaintsModal />', () => {
  const closeModal = jest.fn();
  const handleSubmit = jest.fn();
  const resetEditTaintsResponse = jest.fn();
  const getMachinePools = jest.fn();
  const change = jest.fn();
  const reset = jest.fn();

  const mockData = {
    data: [
      {
        availability_zones: ['us-east-1a'],
        href: '/api/clusters_mgmt/v1/clusters/cluster-id/machine_pools/mp-with-taints',
        id: 'mp-with-taints',
        instance_type: 'm5.xlarge',
        kind: 'MachinePool',
        replicas: 1,
        taints: [
          { key: 'foo1', value: 'bazz1', effect: 'NoSchedule' },
          { key: 'foo2', value: 'bazz2', effect: 'NoSchedule' },
        ],
      },
      {
        availability_zones: ['us-east-1a'],
        href: '/api/clusters_mgmt/v1/clusters/cluster-id/machine_pools/mp-with-taints2',
        id: 'mp-without-taints',
        instance_type: 'm5.xlarge',
        kind: 'MachinePool',
        replicas: 1,
      },
    ],
  };

  const props = {
    closeModal,
    handleSubmit,
    editTaintsResponse: {},
    getMachinePools,
    resetEditTaintsResponse,
    machinePoolsList: mockData,
    change,
    reset,
    invalid: false,
    pristine: true,
    clusterId: 'test-id',
    selectedMachinePoolId: 'mp-without-taints',
  };

  const getEditTaintsModalWrapper = (testProps) =>
    shallow(<EditTaintsModal {...props} {...testProps} />);

  it('renders correctly', () => {
    expect(getEditTaintsModalWrapper()).toMatchSnapshot();
  });

  it('should update taints fields when changing machine pool', () => {
    const mpField = getEditTaintsModalWrapper().find('Field[name="machinePoolId"]');
    const mockEvent = { target: { value: mockData.data[0].id } };
    mpField.props().onChange(mockEvent, mockEvent.target.value);
    expect(change).toHaveBeenCalledWith('taints', mockData.data[0].taints);
  });

  it('should have enabled buttons when it is valid and has changes', () => {
    expect(
      getEditTaintsModalWrapper({ pristine: false }).find('Modal').props().isPrimaryDisabled,
    ).toBeFalsy();
  });

  it('should have disabled primary button when it is invalid', () => {
    expect(
      getEditTaintsModalWrapper({ invalid: true }).find('Modal').props().isPrimaryDisabled,
    ).toBeTruthy();
  });

  it('should have enabled "Add more" button when it is valid', () => {
    expect(
      getEditTaintsModalWrapper({ invalid: false }).find('FieldArray').props().canAddMore,
    ).toBeTruthy();
  });

  it('should have disabled "Add more" button when it is invalid', () => {
    expect(
      getEditTaintsModalWrapper({ invalid: true }).find('FieldArray').props().canAddMore,
    ).toBeFalsy();
  });
});
