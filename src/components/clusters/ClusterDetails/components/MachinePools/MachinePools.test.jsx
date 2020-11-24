import React from 'react';
import { shallow } from 'enzyme';

import MachinePools from './MachinePools';

const baseProps = {
  cluster: {
    managed: false,
  },
  openModal: jest.fn(),
  isAddMachinePoolModalOpen: false,
  deleteMachinePoolResponse: {},
  addMachinePoolResponse: {},
  scaleMachinePoolResponse: {},
  machinePoolsList: { data: [] },
  defaultMachinePool: {},
  getMachinePools: jest.fn(),
  deleteMachinePool: jest.fn(),
  clearGetMachinePoolsResponse: jest.fn(),
};

describe('<MachinePools />', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<MachinePools
      {...baseProps}
    />);
    expect(wrapper).toMatchSnapshot();
  });
});
