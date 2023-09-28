import React from 'react';
import { shallow } from 'enzyme';
import { render, screen } from '~/testUtils';
import { reduxForm } from 'redux-form';

import EditTaintsModal from './EditTaintsModal';
import { normalizedProducts } from '../../../../../../../common/subscriptionTypes';

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
        replicas: 2,
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
        replicas: 2,
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
    selectedMachinePoolId: 'mp-without-taints',
    machineTypes: {
      fulfilled: true,
      pending: false,
      types: {
        aws: [
          {
            id: 'm5.xlarge',
            cpu: {
              value: 4,
            },
            memory: {
              value: 4,
            },
          },
        ],
      },
    },
    cluster: {
      cloud_provider: {
        id: 'aws',
      },
      ccs: {
        enabled: true,
      },
    },
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
    const machinePoolsList = {
      data: [
        ...mockData.data,
        {
          availability_zones: ['us-east-1a'],
          href: '/api/clusters_mgmt/v1/clusters/cluster-id/machine_pools/mp-with-taints2',
          id: 'mp-without-taints1',
          instance_type: 'm5.xlarge',
          kind: 'MachinePool',
          replicas: 2,
        },
      ],
    };
    expect(
      getEditTaintsModalWrapper({ pristine: false, machinePoolsList }).find('Modal').props()
        .isPrimaryDisabled,
    ).toBeFalsy();
  });

  it('should have disabled primary button when it is invalid', () => {
    expect(
      getEditTaintsModalWrapper({ invalid: true }).find('Modal').props().isPrimaryDisabled,
    ).toBeTruthy();
  });

  it('should have enabled "Add more" button when it is valid', () => {
    const machinePoolsList = {
      data: [
        ...mockData.data,
        {
          availability_zones: ['us-east-1a'],
          href: '/api/clusters_mgmt/v1/clusters/cluster-id/machine_pools/mp-with-taints3',
          id: 'mp-without-taints-3',
          instance_type: 'm5.xlarge',
          kind: 'MachinePool',
          replicas: 3,
        },
      ],
    };

    const cluster = {
      product: {
        id: normalizedProducts.ROSA,
      },
      ccs: {
        enabled: true,
      },
      cloud_provider: {
        id: 'aws',
      },
    };
    expect(
      getEditTaintsModalWrapper({ invalid: false, machinePoolsList, cluster })
        .find('FieldArray')
        .props().canAddMore,
    ).toBeTruthy();
  });

  it('should have disabled "Add more" button when it is invalid', () => {
    expect(
      getEditTaintsModalWrapper({ invalid: true }).find('FieldArray').props().canAddMore,
    ).toBeFalsy();
  });

  it('should have disabled "Add more" button when has enforced default MP', () => {
    const cluster = {
      product: {
        id: normalizedProducts.ROSA,
      },
      ccs: {
        enabled: true,
      },
    };

    expect(
      getEditTaintsModalWrapper({ cluster }).find('FieldArray').props().canAddMore,
    ).toBeFalsy();

    cluster.product.id = normalizedProducts.OSD;
    expect(
      getEditTaintsModalWrapper({ cluster }).find('FieldArray').props().canAddMore,
    ).toBeFalsy();

    cluster.product.id = normalizedProducts.OSDTrial;
    expect(
      getEditTaintsModalWrapper({ cluster }).find('FieldArray').props().canAddMore,
    ).toBeFalsy();
  });

  it('non-ccs: should have disabled "Add more" button for "worker" mp', () => {
    const cluster = {
      product: {
        id: normalizedProducts.OSD,
      },
      ccs: {
        enabled: false,
      },
    };

    const machinePoolsList = {
      data: [
        {
          availability_zones: ['us-east-1a'],
          href: '/api/clusters_mgmt/v1/clusters/cluster-id/machine_pools/worker',
          id: 'worker',
          instance_type: 'm5.xlarge',
          kind: 'MachinePool',
          replicas: 2,
        },
        {
          availability_zones: ['us-east-1a'],
          href: '/api/clusters_mgmt/v1/clusters/cluster-id/machine_pools/mp-with-taints2',
          id: 'mp-without-taints',
          instance_type: 'm5.xlarge',
          kind: 'MachinePool',
          replicas: 2,
        },
      ],
    };

    expect(
      getEditTaintsModalWrapper({ cluster, machinePoolsList, selectedMachinePoolId: 'worker' })
        .find('FieldArray')
        .props().canAddMore,
    ).toBeFalsy();
  });

  it('AWS: should have enabled "Add more" button when does not have enforced default MP', () => {
    const machinePoolsList = {
      data: [
        ...mockData.data,
        {
          availability_zones: ['us-east-1a'],
          href: '/api/clusters_mgmt/v1/clusters/cluster-id/machine_pools/mp-with-taints3',
          id: 'mp-without-taints-3',
          instance_type: 'm5.xlarge',
          kind: 'MachinePool',
          replicas: 3,
        },
      ],
    };

    const cluster = {
      product: {
        id: normalizedProducts.ROSA,
      },
      ccs: {
        enabled: true,
      },
      cloud_provider: {
        id: 'aws',
      },
    };

    expect(
      getEditTaintsModalWrapper({ cluster, machinePoolsList }).find('FieldArray').props()
        .canAddMore,
    ).toBeTruthy();

    cluster.product.id = normalizedProducts.OSD;
    expect(
      getEditTaintsModalWrapper({ cluster, machinePoolsList }).find('FieldArray').props()
        .canAddMore,
    ).toBeTruthy();

    cluster.product.id = normalizedProducts.OSDTrial;
    expect(
      getEditTaintsModalWrapper({ cluster, machinePoolsList }).find('FieldArray').props()
        .canAddMore,
    ).toBeTruthy();
  });

  it('GCP: should have enabled "Add more" button when does not have enforced default MP', () => {
    const machinePoolsList = {
      data: [
        {
          availability_zones: ['us-east-1a'],
          href: '/api/clusters_mgmt/v1/clusters/cluster-id/machine_pools/mp-with-taints',
          id: 'mp-with-taints',
          instance_type: 'foo',
          kind: 'MachinePool',
          replicas: 2,
          taints: [
            { key: 'foo1', value: 'bazz1', effect: 'NoSchedule' },
            { key: 'foo2', value: 'bazz2', effect: 'NoSchedule' },
          ],
        },
        {
          availability_zones: ['us-east-1a'],
          href: '/api/clusters_mgmt/v1/clusters/cluster-id/machine_pools/mp-with-taints2',
          id: 'mp-without-taints',
          instance_type: 'foo',
          kind: 'MachinePool',
          replicas: 2,
        },
        {
          availability_zones: ['us-east-1a'],
          href: '/api/clusters_mgmt/v1/clusters/cluster-id/machine_pools/mp-with-taints3',
          id: 'mp-without-taints-3',
          instance_type: 'foo',
          kind: 'MachinePool',
          replicas: 3,
        },
      ],
    };

    const cluster = {
      product: {
        id: normalizedProducts.ROSA,
      },
      ccs: {
        enabled: true,
      },
      cloud_provider: {
        id: 'gcp',
      },
    };

    const machineTypes = {
      fulfilled: true,
      pending: false,
      types: {
        aws: [
          {
            id: 'm5.xlarge',
            cpu: {
              value: 4,
            },
            memory: {
              value: 4,
            },
          },
        ],
        gcp: [
          {
            id: 'foo',
            cpu: {
              value: 6,
            },
            memory: {
              value: 6,
            },
          },
        ],
      },
    };

    expect(
      getEditTaintsModalWrapper({ cluster, machinePoolsList, machineTypes })
        .find('FieldArray')
        .props().canAddMore,
    ).toBeTruthy();

    cluster.product.id = normalizedProducts.OSD;
    expect(
      getEditTaintsModalWrapper({ cluster, machinePoolsList, machineTypes })
        .find('FieldArray')
        .props().canAddMore,
    ).toBeTruthy();

    cluster.product.id = normalizedProducts.OSDTrial;
    expect(
      getEditTaintsModalWrapper({ cluster, machinePoolsList, machineTypes })
        .find('FieldArray')
        .props().canAddMore,
    ).toBeTruthy();
  });

  describe('RTL tests', () => {
    const props = {
      closeModal: jest.fn(),
      handleSubmit: jest.fn(),
      resetEditTaintsResponse: jest.fn(),
      getMachinePools: jest.fn(),
      change: jest.fn(),
      reset: jest.fn(),
      editTaintsResponse: {},
      invalid: false,
      pristine: false,
      machineTypes: {
        fulfilled: true,
        pending: false,
        types: {
          aws: [
            {
              id: 'm5.xlarge',
              cpu: {
                value: 4,
              },
              memory: {
                value: 4,
              },
            },
          ],
        },
      },
      getMachineTypes: jest.fn(),
      cluster: {
        cloud_provider: {
          id: 'aws',
        },
        ccs: {
          enabled: true,
        },
        hypershift: { enabled: true },
      },
      machinePoolsList: {
        data: [
          {
            id: 'mp-with-taints',
            replicas: 2,
            taints: [{ key: 'hello', value: 'world', effect: 'NoSchedule' }],
          },
          {
            id: 'mp1',
            replicas: 1,
          },
          {
            id: 'mp-no-taints',
            replicas: 1,
          },
        ],
      },
      selectedMachinePoolId: '',
    };

    const wizardConnector = (component) => reduxForm({ form: 'editTaints' })(component);

    it.skip('disables the primary button when there are less than 2 replicas without taints for an HCP cluster', () => {
      // Skipping test - ReduxForms will reset the pristine value to always be true
      // and pristine = true causes the primary button to be disabled
      // While this test passes, it is due to the reset pristine value
      const newProps = { ...props, selectedMachinePoolId: 'mp-no-taints' };

      const ConnectedEditTaintsModal = wizardConnector(EditTaintsModal);
      render(<ConnectedEditTaintsModal {...newProps} />);

      expect(
        screen.getByText(
          'Taints cannot be added unless there are at least 2 replicas without taints across all machine pools',
        ),
      ).toBeInTheDocument();

      expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
    });

    it.skip('enables the primary button when adding taints would still leave  at least 2 replicas without taints for an HCP cluster', () => {
      // Skipping test - ReduxForms will reset the pristine value to always be true
      // and pristine = true causes the primary button to be disabled
      // and the input boxes are not rendering so this test always fails
      const newProps = { ...props, selectedMachinePoolId: 'mp-with-taints' };

      const ConnectedEditTaintsModal = wizardConnector(EditTaintsModal);
      render(<ConnectedEditTaintsModal {...newProps} />);

      expect(
        screen.queryByText(
          'Taints cannot be added unless there are at least 2 replicas without taints across all machine pools',
        ),
      ).not.toBeInTheDocument();

      expect(screen.getByRole('button', { name: 'Save' })).not.toBeDisabled();
    });
  });
});
