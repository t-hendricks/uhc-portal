import React from 'react';
import { shallow } from 'enzyme';

import EditNodeCountModal from './EditNodeCountModal';

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
  it('renders correctly', () => {
    const wrapper = shallow(<EditNodeCountModal
      {...baseProps}
    />);
    expect(wrapper).toMatchSnapshot();
  });
});
