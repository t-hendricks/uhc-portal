import React from 'react';
import * as reactRedux from 'react-redux';
import { checkAccessibility, screen, render, userEvent, within, waitFor } from '~/testUtils';
import * as updateMachinePoolsHelpers from './updateMachinePoolsHelpers';

import { UpdatePoolButton, UpdateMachinePoolModal } from './UpdateMachinePoolModal';

const defaultMachinePool = {
  id: 'my-machine-pool',
  version: { id: 'openshift-v4.12.5' },
};

const defaultCluster = {
  id: 'my control plane id',
  version: { available_upgrades: [], id: 'openshift-v4.13.3' },
  hypershift: { enabled: true },
};

const defaultState = {
  clusters: {
    details: {
      cluster: defaultCluster,
    },
  },
  machinePools: {
    getMachinePools: { error: false, fulfilled: true, data: [defaultMachinePool] },
  },
  clusterUpgrades: { schedules: { items: [] } },
  modal: { modalName: 'update-machine-pool-version', data: { machinePool: defaultMachinePool } },
};

jest.mock('react-redux', () => {
  const config = {
    __esModule: true,
    ...jest.requireActual('react-redux'),
  };
  return config;
});

// ********************* Tests ***********************

describe('UpdateMachinePoolModal', () => {
  const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');
  const mockedDispatch = jest.fn();
  useDispatchMock.mockReturnValue(mockedDispatch);

  afterEach(() => {
    useDispatchMock.mockClear();
    mockedDispatch.mockClear();
  });
  describe('<UpdatePoolButton />', () => {
    it('displays the update button when the machine pool version is behind the control plane', async () => {
      const { container, user } = render(
        <UpdatePoolButton machinePool={defaultMachinePool} />,
        {},
        defaultState,
      );

      expect(screen.getByRole('button')).toBeInTheDocument();

      await checkAccessibility(container);

      await user.click(screen.getByRole('button'));

      expect(useDispatchMock).toHaveBeenCalledTimes(1);
      expect(mockedDispatch.mock.calls[0][0].type).toEqual('OPEN_MODAL');
    });

    describe('displays null when', () => {
      it('is not hypershift', () => {
        const newCluster = { ...defaultCluster, hypershift: { enabled: false } };

        const newState = {
          ...defaultState,
          clusters: {
            details: {
              cluster: newCluster,
            },
          },
        };
        const { container } = render(
          <UpdatePoolButton machinePool={defaultMachinePool} />,
          {},
          newState,
        );

        expect(container).toBeEmptyDOMElement();
      });

      it('the control plane version is not known', () => {
        const newCluster = { ...defaultCluster, version: {} };

        const newState = {
          ...defaultState,
          clusters: {
            details: {
              cluster: newCluster,
            },
          },
        };
        const { container } = render(
          <UpdatePoolButton machinePool={defaultMachinePool} />,
          {},
          newState,
        );

        expect(container).toBeEmptyDOMElement();
      });

      it('there is an error getting machine pools', () => {
        const newState = {
          ...defaultState,
          machinePools: {
            getMachinePools: { error: true, fulfilled: true, data: [defaultMachinePool] },
          },
        };
        const { container } = render(
          <UpdatePoolButton machinePool={defaultMachinePool} />,
          {},
          newState,
        );

        expect(container).toBeEmptyDOMElement();
      });

      it('getting the machine pools has not yet been fulfilled', () => {
        const newState = {
          ...defaultState,
          machinePools: {
            getMachinePools: { error: false, fulfilled: false, data: [defaultMachinePool] },
          },
        };
        const { container } = render(
          <UpdatePoolButton machinePool={defaultMachinePool} />,
          {},
          newState,
        );

        expect(container).toBeEmptyDOMElement();
      });

      it('there are not any machine pool', () => {
        const newState = {
          ...defaultState,
          machinePools: {
            getMachinePools: { error: true, fulfilled: true, data: [] },
          },
        };
        const { container } = render(
          <UpdatePoolButton machinePool={defaultMachinePool} />,
          {},
          newState,
        );

        expect(container).toBeEmptyDOMElement();
      });

      it('the control plane is in process of being updated', () => {
        const newState = {
          ...defaultState,
          clusterUpgrades: {
            schedules: {
              items: [
                { upgrade_type: 'OSD', schedule_type: 'automatic', state: { value: 'started' } },
              ],
            },
          },
        };
        const { container } = render(
          <UpdatePoolButton machinePool={defaultMachinePool} />,
          {},
          newState,
        );

        expect(container).toBeEmptyDOMElement();
      });

      it('the control plane has available upgrades', () => {
        const newCluster = {
          ...defaultCluster,
          version: { available_upgrades: ['I am an upgrade object'] },
        };

        const newState = {
          ...defaultState,
          clusters: {
            details: {
              cluster: newCluster,
            },
          },
        };
        const { container } = render(
          <UpdatePoolButton machinePool={defaultMachinePool} />,
          {},
          newState,
        );

        expect(container).toBeEmptyDOMElement();
      });

      it('the machine pool version is not known', () => {
        const newMachinePool = { ...defaultMachinePool, version: {} };
        const { container } = render(
          <UpdatePoolButton machinePool={newMachinePool} />,
          {},
          defaultState,
        );

        expect(container).toBeEmptyDOMElement();
      });

      it('the machine pool version is at the same version as the control plane', () => {
        const newMachinePool = { ...defaultMachinePool, version: { id: 'openshift-v4.13.3' } };

        expect(defaultCluster.version.id).toEqual('openshift-v4.13.3');
        const { container } = render(
          <UpdatePoolButton machinePool={newMachinePool} />,
          {},
          defaultState,
        );

        expect(container).toBeEmptyDOMElement();
      });
    });
  });

  describe('<UpdateMachinePoolModal />', () => {
    const mockUpdatePools = jest.spyOn(updateMachinePoolsHelpers, 'updateAllMachinePools');
    const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');

    afterEach(() => {
      jest.clearAllMocks();
    });
    it('is hidden when redux state has modal closed', () => {
      const newState = { ...defaultState, modal: { data: {} } };
      const { container } = render(<UpdateMachinePoolModal />, {}, newState);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(container).toBeEmptyDOMElement();
    });

    it('displays modal with machine name', async () => {
      const { container } = render(<UpdateMachinePoolModal />, {}, defaultState);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(
        screen.getByText('Update machine pool my-machine-pool', { exact: false }),
      ).toBeInTheDocument();
      await checkAccessibility(container);
    });

    it('calls updateAllMachine pools when clicking on submit ', async () => {
      const mockedDispatch = jest.fn();
      useDispatchMock.mockReturnValue(mockedDispatch);
      mockUpdatePools.mockResolvedValue([]);

      const { user } = render(<UpdateMachinePoolModal />, {}, defaultState);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(mockUpdatePools).toBeCalledTimes(0);

      await user.click(screen.getByRole('button', { name: 'Update machine pool' }));

      await waitFor(() => expect(mockUpdatePools).toBeCalledTimes(1));

      // once to get updated machine pool list, second to close the modal
      expect(mockedDispatch).toHaveBeenCalledTimes(2);
      expect(mockedDispatch.mock.calls[1][0].type).toEqual('CLOSE_MODAL');
    });

    it('displays error', async () => {
      const user = userEvent.setup();
      mockUpdatePools.mockResolvedValue(['I am an error!']);
      const mockedDispatch = jest.fn();
      useDispatchMock.mockReturnValue(mockedDispatch);

      render(<UpdateMachinePoolModal />, {}, defaultState);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(mockUpdatePools).toBeCalledTimes(0);

      await user.click(screen.getByRole('button', { name: 'Update machine pool' }));

      await waitFor(() => expect(mockUpdatePools).toBeCalledTimes(1));
      // once to get updated machine pool list
      expect(mockedDispatch).toHaveBeenCalledTimes(1);

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(
        within(screen.getByRole('alert')).getByText(
          'Machine pool my-machine-pool could not be updated',
        ),
      ).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: 'Danger alert details' }));
      expect(within(screen.getByRole('alert')).getByText('I am an error!')).toBeInTheDocument();

      expect(screen.getByRole('button', { name: 'Update machine pool' })).toBeDisabled();
    });
  });
});
