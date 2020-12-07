import React from 'react';
import { shallow } from 'enzyme';
import { Alert } from '@patternfly/react-core';

import EditNodeCountModal from '../EditNodeCountModal';

const baseProps = {
  openModal: jest.fn(),
  closeModal: jest.fn(),
  handleSubmit: jest.fn(),
  onClose: jest.fn(),
  change: jest.fn(),
  getOrganizationAndQuota: jest.fn(),
  resetScaleDefaultMachinePoolResponse: jest.fn(),
  resetScaleMachinePoolResponse: jest.fn(),
  resetGetMachinePoolsResponse: jest.fn(),
  getMachineTypes: jest.fn(),
  getMachinePools: jest.fn(),
  isOpen: true,
  cloudProviderID: 'gcp',
  product: 'OSD',
  machineTypes: {},
  machinePoolsList: { data: [] },
  organization: {},
  initialValues: {
    id: '',
    nodes_compute: 0,
  },
};

describe('<EditNodeCountModal />', () => {
  const wrapper = shallow(<EditNodeCountModal
    {...baseProps}
  />);

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('renders with master resize warning', () => {
    wrapper.setProps({ masterResizeAlertThreshold: 26 });
    expect(wrapper.find(Alert).length).toEqual(1);
  });
});
