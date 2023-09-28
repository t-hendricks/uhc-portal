import React from 'react';
import { shallow } from 'enzyme';
import { Alert } from '@patternfly/react-core';

import EditNodeCountModal from '../EditNodeCountModal';
import { normalizedProducts, billingModels } from '../../../../../common/subscriptionTypes';

const baseProps = {
  openModal: jest.fn(),
  closeModal: jest.fn(),
  handleSubmit: jest.fn(),
  onClose: jest.fn(),
  change: jest.fn(),
  getOrganizationAndQuota: jest.fn(),
  resetScaleMachinePoolResponse: jest.fn(),
  resetGetMachinePoolsResponse: jest.fn(),
  getMachineTypes: jest.fn(),
  getMachinePools: jest.fn(),
  isOpen: true,
  cloudProviderID: 'gcp',
  product: normalizedProducts.OSD,
  machineTypes: {},
  machinePoolsList: { data: [] },
  organization: {},
  initialValues: {
    id: '',
    nodes_compute: 0,
  },
  isMultiAz: true,
  isBYOC: false,
  billingModel: billingModels.STANDARD,
  cluster: {
    cloud_provider: {
      id: 'aws',
    },
    ccs: {
      enabled: true,
    },
  },
};

describe('<EditNodeCountModal />', () => {
  const wrapper = shallow(<EditNodeCountModal {...baseProps} />);

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('renders with master resize warning', () => {
    wrapper.setProps({ masterResizeAlertThreshold: 26 });
    expect(wrapper.find(Alert).length).toEqual(1);
  });

  // NOTE the following tests should be added, but there is a problem with
  // RTL and Redux Forms always setting "pristine" to true
  // and input boxes are nto rendering making it difficult to test

  it.todo(
    'disables the primary button when scaling to less than 2 replicas without taints for HCP',
  );

  it.todo(
    'disables the primary button when setting minimum nodes (autoscaled) to less than 2 replicas without taints for HCP',
  );

  it.todo(
    'enables the primary button when scaling to  2 replicas or more replicas without taints for HCP',
  );

  it.todo(
    'enables the primary button when scaling to  2 replicas  (autoscaled) or more replicas without taints for HCP',
  );
});
