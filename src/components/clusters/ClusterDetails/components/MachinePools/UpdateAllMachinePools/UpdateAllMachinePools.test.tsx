import React from 'react';
import MockAdapter from 'axios-mock-adapter';
import * as reactRedux from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import apiRequest from '~/services/apiRequest';
import { screen, render, axe, userEvent, within, insightsMock } from '~/testUtils';

import UpdateAllMachinePools from './UpdateAllMachinePools';

const mock = new MockAdapter(apiRequest); // adds ability to mock axios calls

insightsMock();

// ********************* Variables ***********************

const controlPlaneVersion = 'openshift-v4.12.13-candidate';
const clusterId = 'myClusterId';

const updateButtonText = 'Update all Machine pools now';
const errorBannerHeader = 'Some machine pools could not be updated';
const errorAlertLabel = 'Danger Alert';
const warningAlertLabel = 'Warning Alert';
const goToMachinePoolText = 'Go to Machine pools list';

// ********************* Helpers ***********************

const expectUpdateButtonPresence = () => {
  expect(
    within(screen.getByRole('alert', { name: warningAlertLabel })).getByRole('button', {
      name: updateButtonText,
    }),
  ).toBeInTheDocument();
};

const expectUpdateButtonAbsence = (container?: HTMLElement) => {
  expect(screen.queryByRole('button', { name: updateButtonText })).not.toBeInTheDocument();
  if (container) expect(container.firstChild).toBeNull();
};

const clickUpdateButton = async () => {
  const user = userEvent.setup();
  await user.click(screen.getByRole('button', { name: updateButtonText }));
};

// ********************* Default store values ***********************
const machinePoolUpToDate1 = { version: { id: controlPlaneVersion }, id: 'uptodate1' };
const machinePoolUpToDate2 = { version: { id: controlPlaneVersion }, id: 'uptodate2' };

const machinePoolBehind1 = { version: { id: 'openshift-v4.12.5' }, id: 'behind1' };
const machinePoolBehind2 = { version: { id: 'openshift-v4.11.0' }, id: 'behind2' };

const machineAhead1 = { version: { id: 'openshift-v4.12.15-candidate' }, id: 'ahead1' };

const defaultMachinePools = {
  fulfilled: true,
  error: false,
  pending: false,
  data: [machinePoolUpToDate1, machinePoolUpToDate2],
};

const defaultCluster = {
  id: clusterId,
  version: { id: controlPlaneVersion, available_upgrades: [] },
  hypershift: { enabled: true },
};

const defaultStore = {
  machinePools: {
    getMachinePools: defaultMachinePools,
  },
  clusters: {
    details: {
      cluster: defaultCluster,
    },
  },
  clusterUpgrades: {
    schedules: { items: [] },
  },
};

// ********************* Tests ***********************

describe('<UpdateNodePools />', () => {
  describe('hides the update link', () => {
    it('when all machine pools are at the same version as the control plane', () => {
      const newState = {
        ...defaultStore,
        machinePools: {
          getMachinePools: {
            ...defaultMachinePools,
            data: [machinePoolUpToDate1, machinePoolUpToDate2],
          },
        },
      };

      const { container } = render(<UpdateAllMachinePools />, {}, newState);

      expectUpdateButtonAbsence(container);
    });

    it('when it is not a HCP cluster', () => {
      const newState = {
        ...defaultStore,
        machinePools: {
          getMachinePools: {
            ...defaultMachinePools,
            data: [machinePoolBehind1, machinePoolBehind2],
          },
        },
        clusters: { details: { cluster: { ...defaultCluster, hypershift: { enabled: false } } } },
      };

      const { container } = render(<UpdateAllMachinePools />, {}, newState);

      expectUpdateButtonAbsence(container);
    });

    it('when machine pools are still being pulled', () => {
      const machinePools = {
        fulfilled: false,
        error: false,
        data: [],
      };
      const newState = {
        ...defaultStore,
        machinePools: { getMachinePools: machinePools },
      };

      const { container } = render(<UpdateAllMachinePools />, {}, newState);

      expectUpdateButtonAbsence(container);
    });

    it('when there was an error getting the machine pools', () => {
      const machinePools = {
        fulfilled: true,
        error: true,
        data: [machinePoolBehind1, machinePoolBehind2],
      };
      const newState = {
        ...defaultStore,
        machinePools: { getMachinePools: machinePools },
      };

      const { container } = render(<UpdateAllMachinePools />, {}, newState);

      expectUpdateButtonAbsence(container);
    });

    it('when the control plane version is unknown', () => {
      // This is unlikely
      const newState = {
        ...defaultStore,
        machinePools: {
          getMachinePools: {
            ...defaultMachinePools,
            data: [machinePoolBehind1, machinePoolBehind2],
          },
        },
        clusters: { details: { cluster: { ...defaultCluster, version: { id: undefined } } } },
      };

      const { container } = render(<UpdateAllMachinePools />, {}, newState);

      expectUpdateButtonAbsence(container);
    });

    it('when there are no machine pools', () => {
      // This is unlikely
      const newState = {
        ...defaultStore,
        machinePools: { getMachinePools: { ...defaultMachinePools, data: [] } },
      };

      const { container } = render(<UpdateAllMachinePools />, {}, newState);

      expectUpdateButtonAbsence(container);
    });

    it('when all  machine pools are above the control plane', () => {
      // This is extremely unlikely
      const newState = {
        ...defaultStore,
        machinePools: {
          getMachinePools: {
            ...defaultMachinePools,
            data: [machineAhead1],
          },
        },
      };

      const { container } = render(<UpdateAllMachinePools />, {}, newState);

      expectUpdateButtonAbsence(container);
    });

    describe('when the control plane', () => {
      it('has available update versions', () => {
        const newState = {
          ...defaultStore,
          clusters: {
            details: {
              cluster: {
                ...defaultCluster,
                version: {
                  id: controlPlaneVersion,
                  available_upgrades: ['I am an upgrade object'],
                },
              },
            },
          },
        };

        const { container } = render(<UpdateAllMachinePools />, {}, newState);

        expectUpdateButtonAbsence(container);
      });

      it('has a started OSD manual update schedule', () => {
        const newState = {
          ...defaultStore,
          clusterUpgrades: {
            schedules: {
              items: [
                { upgrade_type: 'OSD', schedule_type: 'manual', state: { value: 'started' } },
              ],
            },
          },
        };

        const { container } = render(<UpdateAllMachinePools />, {}, newState);

        expectUpdateButtonAbsence(container);
      });

      it(' has a delayed OSD manual update schedule', () => {
        const newState = {
          ...defaultStore,
          clusterUpgrades: {
            schedules: {
              items: [
                { upgrade_type: 'OSD', schedule_type: 'manual', state: { value: 'delayed' } },
              ],
            },
          },
        };

        const { container } = render(<UpdateAllMachinePools />, {}, newState);

        expectUpdateButtonAbsence(container);
      });

      it('has a started OSD automatic update schedule', () => {
        const newState = {
          ...defaultStore,
          clusterUpgrades: {
            schedules: {
              items: [
                { upgrade_type: 'OSD', schedule_type: 'automatic', state: { value: 'started' } },
              ],
            },
          },
        };

        const { container } = render(<UpdateAllMachinePools />, {}, newState);

        expectUpdateButtonAbsence(container);
      });

      it(' has a delayed OSD automatic update schedule', () => {
        const newState = {
          ...defaultStore,
          clusterUpgrades: {
            schedules: {
              items: [
                { upgrade_type: 'OSD', schedule_type: 'automatic', state: { value: 'delayed' } },
              ],
            },
          },
        };

        const { container } = render(<UpdateAllMachinePools />, {}, newState);

        expectUpdateButtonAbsence(container);
      });
    });
  });

  describe('shows the update link', () => {
    it('is accessible when update link is shown', async () => {
      const newState = {
        ...defaultStore,
        machinePools: {
          getMachinePools: {
            ...defaultMachinePools,
            data: [machinePoolUpToDate1, machinePoolBehind1],
          },
        },
      };
      const { container } = render(<UpdateAllMachinePools />, {}, newState);

      expectUpdateButtonPresence();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('shows update link  and control plane version if at least one machine pool is behind the control plane', async () => {
      // Arrange
      const user = userEvent.setup();
      const newState = {
        ...defaultStore,
        machinePools: {
          getMachinePools: {
            ...defaultMachinePools,
            data: [machinePoolUpToDate1, machinePoolBehind1],
          },
        },
      };

      render(<UpdateAllMachinePools />, {}, newState);
      expectUpdateButtonPresence();

      // Act
      await user.click(screen.getByRole('button', { name: 'Warning alert details' }));

      // Assert
      expect(
        within(screen.getByRole('alert', { name: warningAlertLabel })).getByText('4.12.13', {
          exact: false,
        }),
      ).toBeInTheDocument();
    });
  });

  describe('updates the machine pools', () => {
    // This works because there is a single use of useDispatch (to get machinePools)
    const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');

    afterEach(() => {
      useDispatchMock.mockClear();
      mock.reset();
    });

    it('patchNodePool is called for only machine pools with a version that is behind the control plane ', async () => {
      // ARRANGE
      mock.onPatch().reply(200);
      const dummyDispatch = jest.fn();
      useDispatchMock.mockReturnValue(dummyDispatch);

      const newState = {
        ...defaultStore,
        machinePools: {
          getMachinePools: {
            ...defaultMachinePools,
            data: [machinePoolUpToDate1, machinePoolBehind1],
          },
        },
      };

      render(<UpdateAllMachinePools />, {}, newState);

      expect(mock.history.patch.length).toBe(0);
      expect(dummyDispatch).toHaveBeenCalledTimes(0);
      expectUpdateButtonPresence();

      // ACT
      await clickUpdateButton();

      // ASSERT
      // Ensure single call to patch machine pool
      expect(mock.history.patch.length).toBe(1);
      const patchMachinePool = mock.history.patch[0];
      expect(patchMachinePool.url).toEqual(
        `/api/clusters_mgmt/v1/clusters/${clusterId}/node_pools/${machinePoolBehind1.id}`,
      );
      expect(patchMachinePool.data).toBe(`{"version":{"id":"${controlPlaneVersion}"}}`);

      // Ensure dispatch call to get current state of machine pools
      expect(dummyDispatch).toHaveBeenCalledTimes(1);
    });

    it('shows errors for all patchNodePool requests that fail and is accessible', async () => {
      // ARRANGE
      mock
        .onPatch()
        .replyOnce(500, {
          code: '1234',
          reason: 'I am a bad server',
        })
        .onPatch()
        .reply(200);

      const dummyDispatch = jest.fn();
      useDispatchMock.mockReturnValue(dummyDispatch);

      const user = userEvent.setup();

      const newState = {
        ...defaultStore,
        machinePools: {
          getMachinePools: {
            ...defaultMachinePools,
            data: [machinePoolUpToDate1, machinePoolBehind1, machinePoolBehind2],
          },
        },
      };

      const { container } = render(<UpdateAllMachinePools />, {}, newState);

      expect(mock.history.patch.length).toBe(0);
      expect(dummyDispatch).toHaveBeenCalledTimes(0);
      expectUpdateButtonPresence();
      expect(screen.queryByRole('alert', { name: errorBannerHeader })).not.toBeInTheDocument();

      // ACT
      await clickUpdateButton();

      // ASSERT
      // Ensure two calls to patch machine pools
      expect(mock.history.patch.length).toBe(2);
      const patchMachinePool1 = mock.history.patch[0];
      expect(patchMachinePool1.url).toEqual(
        `/api/clusters_mgmt/v1/clusters/${clusterId}/node_pools/${machinePoolBehind1.id}`,
      );
      expect(patchMachinePool1.data).toBe(`{"version":{"id":"${controlPlaneVersion}"}}`);

      const patchMachinePool2 = mock.history.patch[1];
      expect(patchMachinePool2.url).toEqual(
        `/api/clusters_mgmt/v1/clusters/${clusterId}/node_pools/${machinePoolBehind2.id}`,
      );
      expect(patchMachinePool2.data).toBe(`{"version":{"id":"${controlPlaneVersion}"}}`);

      // Ensure dispatch call to get current state of machine pools
      expect(dummyDispatch).toHaveBeenCalledTimes(1);

      // Ensure alert is shown
      expect(
        within(screen.getByRole('alert', { name: errorAlertLabel })).getByText(errorBannerHeader),
      ).toBeInTheDocument();

      // Make sure error text from api is shown
      await user.click(screen.getByRole('button', { name: 'Danger alert details' }));
      expect(
        screen
          .getByRole('alert', { name: errorAlertLabel })
          .querySelector('.pf-c-alert__description')?.textContent,
      ).toEqual('1234 - I am a bad server');

      // Check for accessibility
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('hides error messages when user clicks on the update machine pool links', async () => {
      // ARRANGE
      mock.onPatch().reply(200);
      const dummyDispatch = jest.fn();
      useDispatchMock.mockReturnValue(dummyDispatch);

      const newState = {
        ...defaultStore,
        machinePools: {
          getMachinePools: {
            ...defaultMachinePools,
            data: [machinePoolBehind1],
          },
        },
      };

      render(<UpdateAllMachinePools initialErrorMessage="This is an error" />, {}, newState);
      expectUpdateButtonPresence();
      expect(screen.getByRole('alert', { name: errorAlertLabel })).toBeInTheDocument();

      // ACT
      await clickUpdateButton();

      // ASSERT
      expect(screen.queryByRole('alert', { name: errorAlertLabel })).not.toBeInTheDocument();
    });

    it('hides the update link while the patchNodePool requests are pending', async () => {
      // ARRANGE
      mock.onPatch().reply(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve([201, null]);
            }, 200); // Introduce a delay so the loading can be caught
          }),
      );

      const dummyDispatch = jest.fn();
      useDispatchMock.mockReturnValue(dummyDispatch);

      const newState = {
        ...defaultStore,
        machinePools: {
          getMachinePools: {
            ...defaultMachinePools,
            data: [machinePoolBehind1],
          },
        },
      };
      render(<UpdateAllMachinePools />, {}, newState);
      expectUpdateButtonPresence();

      // ACT
      await clickUpdateButton();

      // ASSERT
      expect(await screen.findByLabelText('Updating machine pools')).toBeInTheDocument();
      expectUpdateButtonAbsence();
    });
  });

  describe('link to machine tab', () => {
    it('shows when goToMachinePoolTab prop is set', () => {
      const newState = {
        ...defaultStore,
        machinePools: {
          getMachinePools: {
            ...defaultMachinePools,
            data: [machinePoolUpToDate1, machinePoolBehind1],
          },
        },
      };
      render(
        <MemoryRouter>
          <UpdateAllMachinePools goToMachinePoolTab />
        </MemoryRouter>,
        {},
        newState,
      );

      expectUpdateButtonAbsence();
      expect(
        within(screen.getByRole('alert', { name: warningAlertLabel })).getByRole('link', {
          name: goToMachinePoolText,
        }),
      ).toBeInTheDocument();
    });

    it('is hidden when goToMachinePoolTab is not set', () => {
      const newState = {
        ...defaultStore,
        machinePools: {
          getMachinePools: {
            ...defaultMachinePools,
            data: [machinePoolUpToDate1, machinePoolBehind1],
          },
        },
      };
      render(
        <MemoryRouter>
          <UpdateAllMachinePools />
        </MemoryRouter>,
        {},
        newState,
      );

      expectUpdateButtonPresence();
      expect(
        within(screen.getByRole('alert', { name: warningAlertLabel })).queryByRole('link', {
          name: goToMachinePoolText,
        }),
      ).not.toBeInTheDocument();
    });
  });
});
